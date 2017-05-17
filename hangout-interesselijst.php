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


<section id="ventu-hangout-list" class="container ventu-hangout-list-love">
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
    <div class="row">
        <div class="col-sm-4">
            <div class="ventu-card ventu-card--static"
                 style="-moz-user-select: none; touch-action: none; transform: translateX(50px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(-3deg) scale(1, 1); display: block;">
                <div class="ventu-card-image" style="background-image:url(https://ventu.nl/media/objects/d0/15/8f/fe/d0158ffe-178d-41d7-a8af-8117df71f5bf/thumb/1.jpg)"></div>
                <div class="ventu-card-text">
                    <h4>DC Apperlweg Moerdijk, Appelweg 14, 4782 PX, Moerdijk</h4>
                    <h3>Moerdijk</h3>
                    <div class="ventu-card-text-content">

                    </div>
                </div>
            </div>
        </div>


    </div>
</section>


<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</body>
</html>