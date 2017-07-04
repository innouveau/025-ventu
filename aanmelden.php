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

        <section id="ventu-hangout-header-back">
            <div class="row">
                <div class="col-sm-12">
                    <a class="ventu-hangout-header-back-button" href="javascript: window.history.back();">
                        Terug
                    </a>
                </div>
            </div>
        </section>

        <section class="header-section">
            <h1>
                Aanmelden
            </h1>
        </section>

        <section class="ventu-sign-in">
            <div class="ventu-communication-screen">
                <div class="ventu-sign-in-container">
                    <div class="ventu-man-container">
                        <div class="ventu-man">
                            <div class="ventu-man-icon ventu-man-icon--account"></div>
                            <div class="ventu-chat-balloon-container ventu-chat-balloon-left">
                                <div class="ventu-chat-balloon">
                                    <div class="ventu-chat-balloon-top"></div>
                                    <div class="ventu-chat-balloon-middle">
                                        We zullen jouw gegevens niet delen met externe partijen…
                                        lorem ipsum dolor sit amet.
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
                        Meld je aan bij Ventu.nl
                    </h3>

                    <div class="ventu-input-label">
                        E-mail
                    </div>
                    <input type="email" placeholder="Vul een geldig e-mail adres in">
                    <input type="submit" class="btn orange submit-inactive" value="Ga verder"></input>
                </div>
                </form>
            </div>
        </section>

        <?php include('php-includes/about.php'); ?>

        <?php include('php-includes/footer.php'); ?>

        <?php include('php-includes/modals.php'); ?>

    </body>
</html>