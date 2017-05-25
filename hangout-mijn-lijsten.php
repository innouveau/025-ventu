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
    <section id="ventu-hangout-header-back">
        <div class="row">
            <div class="col-sm-12">
                <a class="ventu-hangout-header-back-button" href="">
                    Terug
                </a>
            </div>
        </div>
    </section>

    <section id="ventu-hangout-header-title">
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Mijn interesse lijst
                </h1>
            </div>
        </div>
    </section>



    <section>
        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Mijn lijsten</h3>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-6">
                    <div class="hangout-list-entry">
                        <div class="aspect16by9">
                            <img src="http://realspotter.nl/media/objects/1E/87/D1/77/1E87D177-2066-4047-8114-F25EEF3FBB01/org/1.jpg">
                        </div>
                        <div class="hangout-list-entry-title">
                            <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-love"></div>
                            <div class="hangout-list-entry-title-label">
                                Mijn interesselijst
                            </div>
                        </div>
                        <div class="hangout-list-entry-content">
                            14 objecten
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">

                    <a href="/Team/Team/984BB507-AAFD-4AB1-8653-2E81A41D520F">
                        <div class="hangout-list-entry hangout-list-entry--create">
                            <div class="aspect16by9">

                            </div>
                            <div class="hangout-list-entry-content">
                                <h5>
                                    <span class="hangout-add-button"></span>
                                    Maak hier jouw gedeelde lijst
                                </h5>
                                <p>
                                    <b>Samen vinden doe je met Ventu!</b><br>
                                    Daarom kan je eenvoudig op Ventu lijstjes maken en delen met anderen. Gebruik het
                                    <span class="ventu-icon ventu-icon--in-text ventu-icon--add"></span> icoon om nieuwe objecten toe te voegen en nodig jouw collega’s per email uit om te
                                    reageren en stemmen op hun favoriete objecten.
                                </p>
                                <p>
                                    <b>Begin met jouw lijst</b> <img src="img/tools/arrow-right-grey.svg" style="margin-left: 6px; width: 10px;">
                                </p>
                            </div>

                        </div>
                    </a>

                </div>
            </div>
        </div>

        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Lijsten die ik volg</h3>
                </div>
            </div>

            <div class="row">

                <div class="col-lg-6">

                    <a href="/Team/Team/ADA540A4-2E83-4F7C-B6EA-F9A812D8BF1A">
                        <div class="hangout-list-entry">
                            <div class="aspect16by9">
                                <img src="http://realspotter.nl/media/objects/1E/87/D1/77/1E87D177-2066-4047-8114-F25EEF3FBB01/org/1.jpg">
                            </div>
                            <div class="hangout-list-entry-title">
                                <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-follow"></div>
                                <div class="hangout-list-entry-title-label">
                                    Ik doe mee met lijst
                                </div>
                            </div>
                            <div class="hangout-list-entry-shared-with">
                                <div class="hangout-list-entry-shared-with-number">+3</div>
                                <div class="ventu-avatar-image" style="background-image:url(img/content/4c299dd05d3c6fd7208e18dbd7d824c4_400x400.jpeg)"></div>
                                <div class="ventu-avatar-image ventu-avatar-image--empty-profile"></div>
                                <div class="ventu-avatar-image ventu-avatar-image--no-avatar"></div>
                                <div class="ventu-avatar-image" style="background-image:url(img/content/gp5xqleg0f8jbkxuazos.jpeg)"></div>
                            </div>
                            <div class="hangout-list-entry-content">
                                1 object
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        </div>

        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Mijn verwijderde objecten</h3>
                </div>
            </div>

            <div class="row">

                <div class="col-lg-6">

                    <div class="hangout-list-entry">
                        <div class="aspect16by9">
                            <img src="http://realspotter.nl/media/objects/97/F3/E0/6B/97F3E06B-55B4-4647-9ADF-D76E58F661AD/thumb/1.jpg">
                        </div>
                        <div class="hangout-list-entry-title">
                            <div class="hangout-list-entry-title-icon hangout-list-entry-title-icon-hate"></div>
                            <div class="hangout-list-entry-title-label">
                                Niet interessant
                            </div>
                        </div>
                        <div class="hangout-list-entry-content">
                            6 object
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>



<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</div>

</body>
</html>