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


<section id="ventu-hangout-lists" class="container">
    <div class="row">
        <div class="col-sm-4">
            <h3>Mijn lijsten</h3>

            <div class="hangout-list-entry" style="background-image:url(img/content/kantoor3.jpg)">
                <div class="hangout-list-entry-title">
                    <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-love"></div>
                    <div class="hangout-list-entry-title-label">
                        Mijn interesselijst
                    </div>
                </div>
                <div class="hangout-list-entry-content">
                    55 objecten
                </div>
            </div>

            <div class="hangout-list-entry" style="background-image:url(img/content/kantoor4.jpg)">
                <div class="hangout-list-entry-title">
                    <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-plus"></div>
                    <div class="hangout-list-entry-title-label">
                        Nieuw kantoor voor de zaak
                    </div>
                </div>
                <div class="hangout-list-entry-shared-with">
                    <div class="hangout-list-entry-shared-with-number">+3</div>
                    <div class="ventu-avatar-image" style="background-image:url(img/content/4c299dd05d3c6fd7208e18dbd7d824c4_400x400.jpeg)"></div>
                    <div class="ventu-avatar-image ventu-avatar-image--no-avatar"></div>
                    <div class="ventu-avatar-image" style="background-image:url(img/content/gp5xqleg0f8jbkxuazos.jpeg)"></div>
                </div>
                <div class="hangout-list-entry-content">
                    1 object
                </div>
            </div>
        </div>

        <div class="col-sm-4">
            <h3>Lijsten die ik volg</h3>

            <div class="hangout-list-entry" style="background-image:url(img/content/kantoor4.jpg)">
                <div class="hangout-list-entry-title">
                    <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-follow"></div>
                    <div class="hangout-list-entry-title-label">
                        Nieuw kantoor voor de zaak
                    </div>
                </div>
                <div class="hangout-list-entry-shared-with">
                    <div class="hangout-list-entry-shared-with-number">+3</div>
                    <div class="ventu-avatar-image" style="background-image:url(img/content/4c299dd05d3c6fd7208e18dbd7d824c4_400x400.jpeg)"></div>
                    <div class="ventu-avatar-image ventu-avatar-image--no-avatar"></div>
                    <div class="ventu-avatar-image" style="background-image:url(img/content/gp5xqleg0f8jbkxuazos.jpeg)"></div>
                </div>
                <div class="hangout-list-entry-content">
                    1 object
                </div>
            </div>
        </div>

        <div class="col-sm-4">
            <h3>Mijn verwijderde objecten</h3>

            <div class="hangout-list-entry" style="background-image:url(img/content/kantoor4.jpg)">
                <div class="hangout-list-entry-title">
                    <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-hate"></div>
                    <div class="hangout-list-entry-title-label">
                        Niet interessant
                    </div>
                </div>
                <div class="hangout-list-entry-content">
                    200 object
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