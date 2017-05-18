<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Application</title>

    <?php include('php-includes/standard-files.php'); ?>

    <!-- google maps API -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaU80wDMYEf2w7TL7Wcvoi1tPAZHUzrhA"></script>



    <?php include('php-includes/application-links.php'); ?>

    <script src="js/application/main.js"></script>
</head>

<body class="ventu-application">

    <div id="ventu-application-container">
        <div id="ventu-canvas"></div>

        <?php include('php-includes/application/filters.php'); ?>

        <div id="ventu-bottom-bar"></div>

        <div id="ventu-stack"></div>
    </div>





    <?php include('php-includes/nav.php'); ?>

    <?php include('php-includes/modals.php'); ?>

</body>
</html>