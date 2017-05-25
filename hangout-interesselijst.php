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


<section id="ventu-hangout-list" class="container ventu-hangout-list-love"> <!-- @walstra hier zijn dus ook de classes ventu-hangout-list-hate, ventu-hangout-list-share, ventu-hangout-list-follow -->
    <div class="row ventu-hangout-list-header">
        <div class="col-sm-12">
            <div class="ventu-hangout-list-back">
                Mijn lijsten
            </div>
            <div class="ventu-hangout-list-search">
                <h3>
                    Mijn interesse lijst
                </h3>
                <div class="ventu-search-common">
                    <input placeholder="Zoek op trefwoord">
                </div>
                <div class="ventu-sort"></div>
            </div>

        </div>
    </div>


    <?php include('php-includes/hangout/tools.php'); ?>


    <section id="ventu-hangout-list-cards" class="container">
    <div class="row">
        <div class="col-sm-4">
            <?php getStaticCard(false); ?>
        </div>
        <div class="col-sm-4">
            <?php getStaticCard(true); ?>
        </div>
        <div class="col-sm-4">
            <?php getStaticCard(true); ?>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <?php getStaticCard(true); ?>
        </div>
        <div class="col-sm-4">
            <?php getStaticCard(true); ?>
        </div>
        <div class="col-sm-4">
            <?php getStaticCard(true); ?>
        </div>
    </div>
</section>

</body>


<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</body>
</html>