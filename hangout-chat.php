<?php include('php-includes/static-card.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Hangout Mijn Lijsten</title>

    <?php include('php-includes/standard-files.php'); ?>

    <script src="js/hangout/buttons.js"></script>

</head>

<body class="ventu-hangout">

<?php include('php-includes/nav-logged-in.php'); ?>


<div class="container">
    <section id="ventu-hangout-header-back" class="ventu-hangout-header--share">
        <div class="row">
            <div class="col-sm-4">
                <a class="ventu-hangout-header-back-button" href="">
                    Terug
                </a>
            </div>
            <div class="col-sm-8">
                <div class="ventu-hangout-list-members">
                    <?php include('php-includes/hangout/members.php'); ?>
                    <div class="ventu-hangout-list-members-label">
                        Mijn teamleden:
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="ventu-hangout-header-title" class="ventu-hangout-header--share">
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Dit is onze samen-zoeken lijst
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <?php include('php-includes/hangout/tools.php'); ?>
            </div>
        </div>
    </section>

    <section id="ventu-hangout-content-section">
        <div class="ventu-hangout-lists-wrapper">

            <div class="ventu-hangout-tip ventu-hangout-tip-content">
                <h5>
                    <span class="ventu-hangout-tip-button ventu-hangout-tip-button--profile"></span>
                    Samen vinden doe je met Ventu!
                </h5>
                <p>
                    Samen vinden doe je met Ventu. Daarom kan je eenvoudig op Ventu lijstjes maken en delen met anderen. Gebruik het <span class="ventu-icon ventu-icon--in-text ventu-icon--add"></span> icoon om nieuwe objecten toe te voegen en nodig jouw collega’s per email uit om te reageren en stemmen op hun favoriete objecten.
                </p>
            </div>



            <div class="ventu-card ventu-card--grid ventu-card--float">
                <div class="ventu-card-image">
                    <div class="aspect16by9">
                        <a href="http://realspotter.nl/Project/Nieuwegein/Fultonbaan/16/1E87D177-2066-4047-8114-F25EEF3FBB01?c=1"><img src="http://realspotter.nl/media/objects/1E/87/D1/77/1E87D177-2066-4047-8114-F25EEF3FBB01/org/1.jpg"></a>
                    </div>
                </div>

                <div class="ventu-card-text">
                    <div class="ventu-card-header">
                        <h4>Plettenburgh, Fultonbaan  16, 3439 NE, Nieuwegein</h4>
                    </div>
                    <div class="ventu-features">
                        <ul>
                            <li class="ventu-features-objectusage-1">
                                Kantoor
                            </li>
                            <li class="ventu-features-location">
                                Huur
                            </li>
                            <li class="ventu-features-metrage">
                                1.115 m&sup2;
                            </li>
                            <li class="ventu-features-price">
                                Huurprijs: &euro; 95 m<sup>2</sup>/jr
                            </li>

                        </ul>
                    </div>
                    <?php include('php-includes/card/rating.php'); ?>
                </div>


                <div class="ventu-card-buttons ventu-card-buttons-1">
                    <div class="ventu-card-button-container ventu-card-button--hate">
                        <div class="ventu-card-button">
                            <div class="ventu-card-button-icon"></div>
                        </div>
                        <div class="ventu-card-button-label">
                            Verplaats object naar de niet interessant lijst
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>



    <?php include('php-includes/about.php'); ?>

    <?php include('php-includes/footer.php'); ?>

    <?php include('php-includes/modals.php'); ?>

    <?php include('php-includes/hangout/chat-2.php'); ?>
</div>


</body>
</html>