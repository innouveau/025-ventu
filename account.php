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

<section>
    <h2>Mijn account</h2>
    <div class="ventu-communication-screen">
        <div class="ventu-sign-in-container text-center">
            <img class="ventu-avatar-image ventu-avatar-image--big" src="https://www.gravatar.com/avatar/5455e49389af93f7c4e9ed8905c2c101?s=100&amp;r=r&amp;d=mm" title="Jan Willem H. de Graaf" />
            <p><a href="//nl.gravatar.com" target="_blank">Wijzig jouw profielfoto op Gravatar</a></p>
        </div>
    </div>

    <form action="/Account" class="form-change-account" method="post">                <input type="hidden" name="UniqueId" value="c9ac20fc-88a6-4e52-9513-afbd4310dbcc" />
        <h3>
            Persoonlijke gegevens
        </h3>
        <div class="row">
            <div class="form-group col-lg-6">
                <div class="ventu-input-label">
                    Naam
                </div>
                <input type="text" name="name" id="name" class="form-control" placeholder="Naam" value="Jan Willem H. de Graaf" required autofocus />
            </div>
            <div class="col-sm-6">
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
        <h3>
            Wachtwoord aanpassen
        </h3>
        <div class="row">
            <div class="form-group col-sm-6">
                <div class="ventu-input-label">
                    Wachtwoord
                </div>
                <input type="password" id="password" name="password" class="form-control" placeholder="Minimaal 6 tekens" minlength="6" required>
            </div>
            <div class="form-group col-sm-6">
                <div class="ventu-input-label">
                    Wachtwoord herhalen
                </div>
                <input type="password" id="repeatPassword" name="repeatPassword" class="form-control" placeholder="Minimaal 6 tekens" required>
            </div>
        </div>
        <input class="btn orange" type="submit" value="Aanpassen" />
    </form>
</section>

<section class="lists padding-32">
    <h3>
        Mijn lijsten
    </h3>
    <div class="row">
        <div class="col-sm-4">

            <a class="button-with-icon" href="/Interesselijst">
                <div class="icon-love">
                    <img src="/img/icons/buttons/love.svg" />
                </div>
                <span>Mijn interesselijst</span>
            </a>

        </div>
        <div class="col-sm-4">
            <a class="button-with-icon" href="/Account/RemoveFavorites/">
                <div class="icon-erase">
                    <img src="/img/tools/erase-grey.svg" />
                </div>
                <span>Wis deze lijst</span>
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <a class="button-with-icon" href="/Team/Team/8E335D59-B7C3-41E3-AF40-33292663B7FB/19191919">
                <div class="icon-share">
                    <img src="/img/icons/buttons/share.svg" />
                </div>
                <span>Nieuw kantoor voor Ventu.nl</span>
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">

            <a href="/Prullenbak" class="button-with-icon">
                <div class="icon-hate">
                    <img src="/img/icons/buttons/hate.svg" />
                </div>
                <span>Niet interessant</span>
            </a>

        </div>
        <div class="col-sm-4">
            <a class="button-with-icon" href="/Account/RemoveTrash/">
                <div class="icon-erase">
                    <img src="/img/tools/erase-grey.svg" />
                </div>
                <span>Wis deze lijst</span>
            </a>
        </div>
    </div>

    <h3>Lijsten die ik volg</h3>
    <div class="row">
        <div class="col-sm-4">

            <a href="/Team/Team/0F8A7755-B5FB-4022-AD80-1816D529A361/fb69bf37-aaa9-4301-bbbe-f5fa3d47f68d" class="button-with-icon">
                <div class="icon-group">
                    <img src="/img/icons/buttons/group.svg" />
                </div>
                <span>Calcasa verhuist in Delft</span>
            </a>

        </div>
    </div>
</section>

<section class="padding-32">
    <h3>
        Afmelden
    </h3>
    <a href="javascript:void(0)" id="signout" class="btn orange">Uitloggen</a>
</section>


<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</body>
</html>