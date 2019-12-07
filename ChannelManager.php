<?php
$root = dirname(__FILE__);
require_once($root . DIRECTORY_SEPARATOR .  "SocketData.php");
require_once($root . DIRECTORY_SEPARATOR .  "Client.php");
require_once($root . DIRECTORY_SEPARATOR .  "Channel.php");

/*
The ChannelManager class' responsibility is create and destroy channels, and place clients in the proper channel.
*/
class ChannelManager {
    private $channels;

    function __construct() {
        $this->channels = array();
    }

    function getChannels() {
        return $this->channels;
    }

    function setChannels($channels) {
        $this->channels = $channels;
    }

    function getChannel($id) {
        foreach(array_values($this->channels) as $channel) {
            if ($channel->getId() === $id)
                return $channel;
        }
        return NULL;
    }

    /**
     * Formats data into a JSON object and seals it.
     * @param $message String message
     * @param $username String username of sender
     * @param $channel String channel name
     * @return string a sealed JSON object
     */
    function formatMessage($message, $username, $channel) {
        $messageAssoc = array("message" => $message,
            "username" => $username,
            "channel" => $channel,
            "time" => date("F d, Y h:i:s A", time()),
            "messageId" => 0);
        return SocketData::seal(json_encode($messageAssoc));
    }

    /**
     * Sends message to a recipientSocket
     * This function requires $message to be encoded by the seal function.
     * @param $message String message
     * @param $recipientSocket resource to receive the message
     * @return int The number of bytes successfully written to the socket or False on failure.
     */
    function send($message, $recipientSocket) {
        return @socket_write($recipientSocket, $message, strlen($message));
    }

    /**
     * Broadcasts a message to all users of the specified channel.
     * This function requires $message to be encoded by the seal function.
     * @param $message String message
     * @param $channelName String The name of the channel to send message to.
     * @return int The number of bytes successfully written to the socket or False on failure.
     */
	function broadcast($message, $channelId) {
	    $status = true;
	    $channel = $this->getChannel($channelId);
        if ($channel != NULL) {
            foreach ($channel->getClients() as $client) {
                $this->send($message, $client->getSocket());
            }
        }
        else {
            $status = false;
        }
		return $status;
	}

	/*
	 * Broadcasts a message to the specified channel that a new user has joined.
	 */
	function broadcastClientJoined($username, $channelId) {
        $message = "{$username} has joined the chat.";
        $channelName = $this->getChannel($channelId)->getName();
		$formattedMessage = $this->formatMessage($message, $username, $channelName);
		$this->broadcast($formattedMessage, $channelId);
	}

    /*
     * Broadcast a message to the specified channel that a user has left.
     */
	function broadcastClientLeft($username, $channelId) {
        $message = "{$username} has left the chat.";
        $channelName = $this->getChannel($channelId)->getName();
		$formattedMessage = $this->formatMessage($message, $username, $channelName);
		$this->broadcast($formattedMessage, $channelId);
	}

	/*
	 * Adds a channel to $channels.
	 */
	function addChannel($id, $name) {
        $newChannel = new Channel($id, $name, array());
        array_push($this->channels, $newChannel);
        return $newChannel;
    }

    /*
     * Returns true if there is a channel with id
     */ 
    function containsChannel($id) {
        foreach ($this->channels as $channel) {
            if ($channel->getId() === $id) {
                return true;
            }
        }
        return false;
    }

    /*
     * Adds a Client object to the specified channel.
     * Precondition: A Channel with $channelId must already exist in $this->channels.
     */
	function addClientToChannel($channelId, $client) {
	    $channel = $this->getChannel($channelId);
	    $channel->addReplaceClient($client);
    }

    /*
     * Removes the $client from the specified channel.
     * Returns the client's socket resource.
     */
    function removeClientFromChannel($channelId, $clientId) {
        $channel = $this->getChannel($channelId);
        $clientSocket = NULL;
        if ($channel != NULL) {
            $clientSocket = $channel->removeClientById($clientId);
        }
        return $clientSocket;
    }

    /*
     * Handles a new client connection by placing them in their channel if available,
     * and sending a greeting.
     */
    function addNewClient($clientSocket, $clientInfo) {
        $clientId = $clientInfo["clientId"];
        $clientUsername = $clientInfo["username"];
        $channelId = $clientInfo["channelId"];
        $channelName = $clientInfo["channelName"];
        $newClient = new Client($clientId, $clientUsername, $clientSocket);
        //If the channel does not already exist, then create it.
        if ($this->getChannel($channelId) === NULL) {
            $this->addChannel($channelId, $channelName);
        }
        $this->addClientToChannel($channelId, $newClient);
    }

    /*
     * Handles a socket message according to the message association's content.
     *
     * There are currently two message types: Broadcast, MoveToChannel
     */
    function handleSocketMessage($clientSocket, $messageAssoc) {
        $clientId = $messageAssoc["clientId"];
        if (isset($messageAssoc["action"])) {
            if ($messageAssoc["action"] === "LeaveChannel") {
                $this->removeClientFromChannel($messageAssoc["channelId"], $clientId);
            }
            else if ($messageAssoc["action"] === "JoinChannel") {
                $username = $messageAssoc["username"];
                $channelId = $messageAssoc["channelId"];
                if (!isset($channelId)) {
                    error_log("Channel ID not set.\n", 3, LOG_URL);
                }
                //If it doesn't already exist, create the channel the client is joining.
                if ($this->getChannel($channelId) === NULL) {
                    $this->addChannel($channelId, $messageAssoc["channelName"]);
                }
                $client = new Client($clientId, $username, $clientSocket);
                $this->addClientToChannel($channelId, $client);
                $this->broadcastClientJoined($username, $channelId);
            }
            else if ($messageAssoc["action"] === "notifyFriendRequest") {
                $username = $messageAssoc["username"];
                $this->notifyFriendRequest($username, $clientId);
            }
        }
        else {
            $message = $messageAssoc["message"];
            $username = $messageAssoc["username"];
            $channelId = $messageAssoc["channelId"];
            $channelName = $messageAssoc["channelName"];
            $this->broadcast($this->formatMessage($message, $username, $channelName), $channelId);
        }
    }

    //Attempts to retrieve the channel that a client with $username belongs to.
    function getClientFromChannels($clientId) {
        $channels = $this->getChannels();
        foreach ($channels as $channel) {
            $client = $channel->getClientById($clientId);
            if ($client != NULL) {
                return $client;
            }
        }
        return NULL;
    }

    //Attempts to send a friend request message to a user with $toUsername if they are online.
    function notifyFriendRequest($fromUsername, $toUserId) {
        $toClient = $this->getClientFromChannels($toUserId);
        if ($toClient != NULL) {
            $message = $this->formatMessage("You have a friend request from {$fromUsername}.", $fromUsername, "testChannel");
            $this->send($message, $toClient->getSocket());
            return true;
        }
        return false;
    }
}