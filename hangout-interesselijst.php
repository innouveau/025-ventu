<?php include('php-includes/static-card.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Hangout Mijn Lijsten</title>

    <?php include('php-includes/standard-files.php'); ?>

    <script src="js/sign-in/main.js"></script>

</head>

<body class="ventu-hangout">

<?php include('php-includes/nav-logged-in.php'); ?>


<div class="container">
    <section id="ventu-hangout-header-back" class="ventu-hangout-header--share">
        <div class="row">
            <div class="col-sm-12">
                <a class="ventu-hangout-header-back-button" href="">
                    Terug
                </a>
            </div>
        </div>
    </section>

    <section id="ventu-hangout-header-title" class="ventu-hangout-header--share">
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Mijn interesse lijst
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <?php include('php-includes/hangout/tools.php'); ?>
            </div>
        </div>
    </section>

    <section>
        <div class="ventu-hangout-lists-wrapper">

            <div class="ventu-hangout-tip">
                <h5>
                    <span class="ventu-hangout-profile-button"></span>
                    Samen vinden doe je met Ventu!
                </h5>
                <p>
                    Samen vinden doe je met Ventu. Daarom kan je eenvoudig op Ventu lijstjes maken en delen met anderen. Gebruik het        icoon om nieuwe objecten toe te voegen en nodig jouw collega’s per email uit om te reageren en stemmen op hun favoriete objecten.
                </p>
            </div>

            <?php include('php-includes/hangout/original-cards.php'); ?>
        </div>
    </section>



    <?php include('php-includes/about.php'); ?>

    <?php include('php-includes/footer.php'); ?>

    <?php include('php-includes/modals.php'); ?>
</div>


</body>
</html>