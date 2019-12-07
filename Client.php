<?php
/*
 * The Client class' responsibility is to encapsulate a client and their data.
 */
class Client {
    private $id;
    private $username;
    private $socket;

    function __construct($id, $username, $socketResource)
    {
        $this->id = $id;
        $this->username = $username;
        $this->socket = $socketResource;
    }

    function getId() {
        return $this->id;
    }
    
    public function setId($clientId) {
        $this->id = $clientId;
    }

    public function getUsername() {
        return $this->username;
    }

    public function setUsername($clientUsername) {
        $this->username = $clientUsername;
    }

    public function getSocket() {
        return $this->socket;
    }

    public function setSocket($socketResource) {
        $this->socket = $socketResource;
    }
}