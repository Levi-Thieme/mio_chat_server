<?php
$root = dirname(__FILE__);
require_once($root . DIRECTORY_SEPARATOR .  "SocketData.php");
require_once($root . DIRECTORY_SEPARATOR .  "ChannelManager.php");
define("LOG_URL", $root . DIRECTORY_SEPARATOR .   "logs" . DIRECTORY_SEPARATOR . "socket_error_log.txt");
class SocketServer {
    private $channelManager;
    private $clients;

    function __construct($channelManager) {
        $this->channelManager = $channelManager;
        $this->clients = array();
    }

    //Helper functions

    /*
    * Performs a handshake with the client socket resource.
    */
    function createHandshakeMessage($received_header, $host_name, $port) {
        $headers = array();
        $lines = preg_split("/\r\n/", $received_header);
        foreach($lines as $line)
        {
            $line = chop($line);
            if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
            {
                $headers[$matches[1]] = $matches[2];
            }
        }
        $secKey = $headers['Sec-WebSocket-Key'];
        $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
        $buffer  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $host_name\r\n" .
            "WebSocket-Location: ws://$host_name:$port/demo/shout.php\r\n".
            "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
        return $buffer;
    }

    /*
    * Returns an error message describing the last socket error's code.
    */
    function getErrorMessage() {
        $errorCode = socket_last_error();
        $errorMessage = socket_strerror($errorCode);
        return $errorMessage;
    }

    /*
    Handles a new client connection.
    */
    function attemptNewClientAccept($serverSocket, &$clientInfo) {
        $newClient = socket_accept($serverSocket);
        if ($newClient === false) {
            $errorMessage = $this->getErrorMessage();
            error_log($errorMessage . "\n", 3, LOG_URL);
        }
        else {
            $header = socket_read($newClient, 1024);
            $handshakeMessage = $this->createHandshakeMessage($header, HOST_NAME, PORT);
            socket_write($newClient, $handshakeMessage, strlen($handshakeMessage));
            if (socket_recv($newClient, $receiveBuffer, 1024, 0) > 0) {
                $clientInfo = json_decode(SocketData::unseal($receiveBuffer), true);
            }
        }
        return $newClient;
    }

    /*
    Removes $socketToRemove from $sockets
    */
    function removeSocket(&$sockets, &$socketToRemove) {
        $socketToRemoveIndex = array_search($socketToRemove, $sockets);
        unset($sockets[$socketToRemoveIndex]);
    }
    //end helper functions

    public function Listen() {
        error_log("Listening...\n", 3, LOG_URL);
        define('HOST_NAME', "localhost");
        define('PORT', "8080");
        $null = NULL;
        //serverSocket listens for and accepts any new client socket connection requests
        $serverSocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_set_option($serverSocket, SOL_SOCKET, SO_REUSEADDR, 1);
        socket_bind($serverSocket, HOST_NAME, PORT);
        socket_listen($serverSocket);
        //Enter infinite loop of receiving data from client sockets and handling new client socket connections.
        while (true) {
            $socketsToRead = $this->clients;
            array_push($socketsToRead, $serverSocket);
            /*
            * Get the number of sockets that have data available to read and handle new connections.
            * If $toRead == 0, then no new connections need to be handled nor do any sockets need to be read from.
            * If $serverSocket is in $readSockets, then a new socket connection needs to be accepted.
            * If $serverSocket is not in $readSockets AND $toRead > 0, then the sockets in $readSockets need to be read from.
            */
            $needReadCount = socket_select($socketsToRead, $null, $null, $null, $null);
            //If $serverSocket is in the $readSockets array, then a new connection has been requested by a remote client socket.
            if (in_array($serverSocket, $socketsToRead)) {
                $clientInfo;
                $newClient = $this->attemptNewClientAccept($serverSocket, $clientInfo);
                if ($newClient !== false && $clientInfo != NULL && $clientInfo !== false) {
                    $this->clients[] = $newClient;
                    $this->channelManager->addNewClient($newClient, $clientInfo);
                }
                //remove the serverSocket from the readSockets array
                $this->removeSocket($socketsToRead, $serverSocket);
            }
            //Receive incoming data from client sockets
            foreach ($socketsToRead as $socketToRead) {
                $socketData = socket_read($socketToRead, 8096);
                //close and unset any sockets closed by the client
                if ($socketData == false || $socketData == "") {
                    @socket_close($socketToRead);
                    $this->removeSocket($this->clients, $socketToRead);
                }
                else {
                    $socketMessage = SocketData::unseal($socketData);
                    $json = json_decode($socketMessage, true);
                    //Pass off the JSON message to $channelManager to be handled.
                    $this->channelManager->handleSocketMessage($socketToRead, $json);
                }
            }
        }
        socket_close($serverSocket);
    }
}
$socketServer = new SocketServer(new ChannelManager());
error_log("Initializing SocketServer\n", 3, LOG_URL);
$socketServer->Listen();
error_log("Quitting...\n", 3, LOG_URL);