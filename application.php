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

    <!-- assets -->
    <script src="assets/jquery/jquery.min.js"></script>
    <script src="assets/bootstrap/bootstrap.min.js"></script>
    <script src="assets/select2/select2.js"></script>
    <script src='assets/hammer/hammer.js'></script>

    <!-- ventu filter -->
    <script src="js/shared/modules/ventu-filter/Filter.js"></script>

    <!-- ventu app -->
    <script src="js/application/models/Responsive.js"></script>
    <script src="js/application/models/Card.js"></script>
    <script src="js/application/models/Map.js"></script>
    <script src="js/application/models/Map-mobile.js"></script>
    <script src="js/application/models/Marker.js"></script>
    <script src="js/application/models/Building.js"></script>
    <script src="js/application/models/Data-service.js"></script>
    <script src="js/application/models/Data-faker.js"></script>
    <script src="js/application/models/Config.js"></script>
    <script src="js/application/models/Guide.js"></script>
    <script src="js/application/models/List.js"></script>
    <script src="js/application/models/List-mobile.js"></script>
    <script src="js/application/models/User.js"></script>
    <script src="js/application/models/App.js"></script>

    <!-- fake data -->
    <script src="js/application/content/user.js"></script>
    <script src="js/application/content/markers.js"></script>
    <script src="js/application/content/objects.js"></script>
    <script src="js/application/content/amsterdam.js"></script>

    <!-- dom -->
    <script src="js/application/dom/filter-listeners.js"></script>

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