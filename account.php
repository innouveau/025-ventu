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
        Mijn account
    </h1>
</section>

<section>
    <div class="sub-section">
        <div class="ventu-communication-screen">
            <div class="ventu-sign-in-container text-center">
                <img class="ventu-avatar-image ventu-avatar-image--big" src="https://www.gravatar.com/avatar/5455e49389af93f7c4e9ed8905c2c101?s=100&amp;r=r&amp;d=mm" title="Jan Willem H. de Graaf" />
                <p><a href="//nl.gravatar.com" target="_blank">Wijzig jouw profielfoto op Gravatar</a></p>
            </div>
        </div>

        <form action="/Account" class="form-change-account" method="post">                <input type="hidden" name="UniqueId" value="c9ac20fc-88a6-4e52-9513-afbd4310dbcc" />
            <h4>
                Persoonlijke gegevens
            </h4>
            <div class="row">
                <div class="form-group col-lg-6">
                    <div class="ventu-input-label">
                        Naam
                    </div>
                    <input type="text" name="name" id="name" class="form-control" placeholder="Naam" value="Jan Willem H. de Graaf" required autofocus />
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-input-label">
                        E-mailadres
                    </div>
                    <input type="email" name="emailAddress" id="emailAddress" class="form-control" placeholder="E-mailadres" value="janwillemhdegraaf@gmail.com" required />
                </div>
            </div>
            <div class="row">
                <div class="form-group col-lg-6">
                    <div class="ventu-input-label">
                        Telefoonummer
                    </div>
                    <input type="text" name="phonenumber" id="phonenumber" class="form-control" placeholder="Telefoonummer" value="0650730879" required />
                </div>

                <div class="form-group col-lg-6">
                    <div class="ventu-input-label">
                        Bedrijfsnaam
                    </div>
                    <input type="text" name="organizationName" id="organizationName" class="form-control" placeholder="Bedrijfsnaam" autofocus value="Narozeni" required />
                </div>
            </div>
            <input class="btn orange" type="submit" value="Account bijwerken" />
        </form><form action="/Account/SetNewPassword" class="form-change-password" method="post">                <input type="hidden" name="u" value="c9ac20fc-88a6-4e52-9513-afbd4310dbcc" />
            <h4>
                Wachtwoord aanpassen
            </h4>
            <div class="row">
                <div class="form-group col-sm-4">
                    <div class="ventu-input-label">
                        Wachtwoord
                    </div>
                    <input type="password" id="password" name="password" class="form-control" placeholder="Minimaal 6 tekens" minlength="6" required>
                </div>
                <div class="form-group col-sm-4">
                    <div class="ventu-input-label">
                        Wachtwoord herhalen
                    </div>
                    <input type="password" id="repeatPassword" name="repeatPassword" class="form-control" placeholder="Minimaal 6 tekens" required>
                </div>
            </div>
            <input class="btn orange" type="submit" value="Aanpassen" />
        </form>
    </div>

    <div class="sub-section">
        <h4>
            Mijn lijsten
        </h4>

        <div id="ventu-account-lists">
            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="/Interesselijst">
                        <div class="ventu-icon ventu-icon--love"></div>
                        <span class="ventu-account-list-label">
                            Mijn interesselijst
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="/Interesselijst">
                        <div class="ventu-icon ventu-icon--share"></div>
                        <span class="ventu-account-list-label">
                            Mijn gedeelde lijsten
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="/Interesselijst">
                        <div class="ventu-icon ventu-icon--hate"></div>
                        <span class="ventu-account-list-label">
                            Niet interessant
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12">
                    <div class="col-spacer"></div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <div class="ventu-icon ventu-icon--follow"></div>
                    <span class="ventu-account-list-label">
                        lijsten die ik volg
                    </span>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="">
                        <div class="ventu-icon-spacer"></div>
                        <span class="ventu-account-list-label ventu-account-list-label-light">
                            Lijst 1
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="">
                        <div class="ventu-icon-spacer"></div>
                        <span class="ventu-account-list-label ventu-account-list-label-light">
                            Lijst 2
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-9 col-sm-4">
                    <a href="">
                        <div class="ventu-icon-spacer"></div>
                        <span class="ventu-account-list-label ventu-account-list-label-light">
                            Lijst 3
                        </span>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-4">
                    <div class="ventu-tools-button ventu-tools-button--erase">
                        <div class="ventu-tools-button-label">
                            Wis deze lijst
                        </div>
                        <div class="ventu-tools-button-icon"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="sub-section">
        <h4>
            Afmelden
        </h4>
        <a href="javascript:void(0)" id="signout" class="btn orange">Uitloggen</a>
    </div>
</section>


<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</body>
</html>