<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Sign In</title>

    <?php include('php-includes/standard-files.php'); ?>

    <script src="js/sign-in/main.js"></script>

</head>

    <body class="ventu-sign-in-page">

        <?php include('php-includes/nav.php'); ?>

        <section class="ventu-sign-in">

                <h2>Registreren</h2>
                <div class="ventu-communication-screen">
                    <div class="ventu-sign-in-container">
                        <div class="ventu-man-container">
                            <div class="ventu-man">
                                <div class="ventu-man-icon ventu-man-icon--account"></div>
                                <div class="ventu-chat-balloon-container ventu-chat-balloon-left">
                                    <div class="ventu-chat-balloon">
                                        <div class="ventu-chat-balloon-top"></div>
                                        <div class="ventu-chat-balloon-middle">
                                            Registreer je bij Ventu om toegang te krijgen tot… ipsum dolor sit amet lorem.
                                        </div>
                                        <div class="ventu-chat-balloon-bottom"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ventu-sign-in-container">
                    <form>
                    <div class="ventu-form-section">
                        <h3>
                            Vul je gegevens aan
                        </h3>

                        <div class="ventu-input-label">
                            Naam
                        </div>
                        <input type="email" placeholder="Naam">

                        <div class="ventu-input-label">
                            Bedrijf
                        </div>
                        <input type="email" placeholder="Bedrijf">

                        <div class="ventu-input-label">
                            Telefoon
                        </div>
                        <input type="email" placeholder="Telefoon">
                    </div>

                        <div class="ventu-form-section">
                            <h3>
                                Stel een wachtwoord in
                            </h3>

                            <div class="ventu-input-label">
                                Wachtwoord
                            </div>
                            <input type="email" placeholder="Minimaal 6 tekens">

                            <div class="ventu-input-label">
                                Herhaal wachtword
                            </div>
                            <input type="email" placeholder="Minimaal 6 tekens">

                            <input type="submit" class="btn orange submit-inactive" value="Bevestig mijn account"></input>
                        </div>
                    </form>
                </div>

        </section>

        <?php include('php-includes/about.php'); ?>

        <?php include('php-includes/footer.php'); ?>

        <?php include('php-includes/modals.php'); ?>

    </body>
</html>