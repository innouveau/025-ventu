<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Home</title>

    <?php include('php-includes/standard-files.php'); ?>

    <script src="js/home/main.js"></script>
</head>

    <body class="ventu-home">


        <?php include('php-includes/nav.php'); ?>

        <?php include('php-includes/dialog/dialog.php'); ?>

        <div class="container">
            <?php include('php-includes/usp.php'); ?>

            <?php include('php-includes/hangout.php'); ?>

            <?php include('php-includes/search-entry.php'); ?>

            <?php include('php-includes/inspiration.php'); ?>

            <?php include('php-includes/discover.php'); ?>

            <?php include('php-includes/about.php'); ?>

            <?php include('php-includes/direct-links.php'); ?>

            <?php include('php-includes/footer.php'); ?>
        </div>

        <?php include('php-includes/modals.php'); ?>
    </body>
</html>