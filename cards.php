<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Cards</title>

    <?php include('php-includes/standard-files.php'); ?>

    <?php include('php-includes/application-links.php'); ?>

    <script src="js/home/main.js"></script>
</head>

<body class="ventu-home">


<?php include('php-includes/nav.php'); ?>


<div class="container">
    <section>
        <div class="row">
            <div class="col-sm-4">
                <div class="ventu-card ventu-card--static ventu-card--grid">
                    <div class="ventu-card-image" style="background-image:url(img/content/kantoor2.jpg)"></div>
                    <div class="ventu-card-text">
                        <div class="ventu-card-header">
                            <h4>Test Cards</h4>
                            <h3>Grid Variant</h3>
                        </div>
                        <?php include('php-includes/features.php');?>
                    </div>
                    <?php include('php-includes/card/buttons.php');?>
                </div>



            </div>
            <div class="col-sm-4">
                <div class="ventu-card ventu-card--static ventu-card--grid">
                    <div class="ventu-card-image" style="background-image:url(img/content/kantoor2.jpg)"></div>
                    <div class="ventu-card-text">
                        <div class="ventu-card-header">
                            <h4>Test Cards</h4>
                            <h3>Grid Group Entry Variant</h3>
                        </div>
                    </div>
                    <div class="ventu-card-buttons">
                        <div class="ventu-card-button-container ventu-card-button-container--full">
                            <div class="ventu-card-button ventu-card-button--group">
                                <div class="ventu-card-button-icon"></div>
                            </div>
                            <div class="ventu-card-button-label">
                                Laat groep zien
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4" style="height:500px">
                <div class="ventu-card ventu-card--absolute" style="-moz-user-select: none; touch-action: none; transform: translateX(50px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(-8deg) scale(1, 1);">
                    <div class="ventu-card-image" style="background-image:url(img/content/kantoor2.jpg)"></div>
                    <div class="ventu-card-text">
                        <div class="ventu-card-header">
                            <h4>Test Cards</h4>
                            <h3>Absolute Variant</h3>
                        </div>
                        <?php include('php-includes/features.php');?>
                    </div>
                    <?php include('php-includes/card/buttons.php');?>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <div class="ventu-card ventu-card--grid ventu-card--float">
                    <div class="ventu-card-image" style="background-image:url(img/content/kantoor2.jpg)"></div>
                    <div class="ventu-card-text">
                        <div class="ventu-card-header">
                            <h4>Test Cards 1</h4>
                            <h3>Float variant (responsive)</h3>
                        </div>
                        <?php include('php-includes/features.php');?>
                    </div>
                    <?php include('php-includes/card/buttons.php');?>
                </div>
            </div>
        </div>
    </section>


</div>

<?php include('php-includes/modals.php'); ?>
</body>
</html>