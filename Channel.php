<?php
/*
The Channel class represents a chat room and provides
functions for adding/removing clients.
*/
class Channel {
    private $id;
    private $name;
    private $clients;

    function __construct($id, $name, $clients) {
        $this->id = $id;
        $this->name = $name;
        $this->clients = $clients;
    }

    public function addClient($client) {
        array_push($this->clients, $client);
    }

    public function addReplaceClient($client) {
        $containedClient = $this->getClientById($client->getId());
        if ($containedClient != NULL) {
            $this->removeClient($containedClient);
        }
        $this->addClient($client);
    }

    public function removeClient($client) {
        unset($this->clients[array_search($client, $this->clients)]);
    }

    public function removeClientById($id) {
        foreach ($this->clients as $client) {
            if ($client->getId() === $id) {
                $socket = $client->getSocket();
                $this->removeClient($client);
                return $socket;
            }
        }
        return false;
    }

    public function getClientById($id) {
        foreach ($this->clients as $client) {
            if ($client->getId() === $id) {
                return $client;
            }
        }
        return NULL;
    }

    public function getClientByUsername($username) {
        foreach ($this->clients as $client) {
            if ($client->getUsername() === $username) {
                return $client;
            }
        }
        return NULL;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($channelId) {
        $this->id = $channelId;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($channelName) {
        $this->name = $channelName;
    }

    public function getClients() {
        return $this->clients;
    }

    public function setClients($clients) {
        $this->clients = $clients;
    }
}