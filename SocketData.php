<?php
class SocketData {
    /*
    * Removes the header added by seal from $socketData,
    * and returns a decoded version of $socketData.
    */
    public static function unseal($socketData) {
        $length = ord($socketData[1]) & 127;
        if($length == 126) {
            $masks = substr($socketData, 4, 4);
            $data = substr($socketData, 8);
        }
        elseif($length == 127) {
            $masks = substr($socketData, 10, 4);
            $data = substr($socketData, 14);
        }
        else {
            $masks = substr($socketData, 2, 4);
            $data = substr($socketData, 6);
        }
        $socketData = "";
        for ($i = 0; $i < strlen($data); ++$i) {
            $socketData .= $data[$i] ^ $masks[$i%4];
        }
        return $socketData;
    }

    /*
    * Prepends a header onto $socketData to describe the contents.
    */
    public static function seal($socketData) {
        $b1 = 0x80 | (0x1 & 0x0f);
        $length = strlen($socketData);
        $header = "";
        if($length <= 125)
            $header = pack('CC', $b1, $length);
        elseif($length > 125 && $length < 65536)
            $header = pack('CCn', $b1, 126, $length);
        elseif($length >= 65536)
            $header = pack('CCNN', $b1, 127, $length);
        return $header.$socketData;
    }
}