<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nomeSposa = htmlspecialchars($_POST["nome_sposa"]);
    $nomeSposo = htmlspecialchars($_POST["nome_sposo"]);
    $email = htmlspecialchars($_POST["email"]);
    $telefono = htmlspecialchars($_POST["telefono"]);
    $dataMatrimonio = htmlspecialchars($_POST["data_matrimonio"]);
    $location = htmlspecialchars($_POST["location"]);
    $servizio = htmlspecialchars($_POST["servizio"]);
    $messaggio = htmlspecialchars($_POST["messaggio"]);

    $to = "tuaemail@gmail.com"; // da inserie email
    $subject = "Nuova richiesta dal sito web";

    $body = "
    Nuovo contatto dal sito:

    Sposa: $nomeSposa
    Sposo: $nomeSposo
    Email: $email
    Telefono: $telefono
    Data Matrimonio: $dataMatrimonio
    Location: $location
    Servizio: $servizio

    Messaggio:
    $messaggio
    ";

    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Messaggio inviato con successo!";
    } else {
        echo "Errore nell'invio del messaggio.";
    }
}
?>