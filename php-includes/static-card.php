<?php


function getStaticCard($love) {
$bgs = ['kantoor2.jpg', 'kantoor3.jpg', 'kantoor4.jpg', 'kantoor5.jpg', 'kantoor6.jpg', 'kantoor7.jpg', 'kantoor8.jpg'];
$bg = $bgs[array_rand($bgs, 1)];
$texts = ['DC Apperlweg Moerdijk, Appelweg 14, 4782 PX, Moerdijk DC Apperlweg Moerdijk, Appelweg 14, 4782 PX, Moerdijk', 'Korte tekst'];
$t = $texts[array_rand($texts, 1)];
?>

<div class="ventu-card ventu-card--static ventu-card--grid">
    <div class="ventu-card-image">
        <div class="aspect16by9">
            <img src="img/content/<?php echo $bg; ?>">
        </div>
    </div>
    <div class="ventu-card-text">
        <div class="ventu-card-header">
            <h4><?php echo $t; ?></h4>
            <h3>Moerdijk</h3>
        </div>
        <?php include('features.php');?>
    </div>

    <?php
    if ($love) { ?>

        <div class="ventu-card-buttons">
            <div class="ventu-card-button-container ventu-card-button--hate">
                <div class="ventu-card-button">
                    <div class="ventu-card-button-icon"></div>
                </div>
                <div class="ventu-card-button-label">
                    Niet interessant
                </div>
            </div>
            <div class="ventu-card-button-container ventu-card-button--share">
                <div class="ventu-card-button">
                    <div class="ventu-card-button-icon"></div>
                </div>
                <div class="ventu-card-button-label">
                    Zet in gedeeld
                </div>
            </div>
        </div>

        <?php } else { ?>

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

        <?php } ?>
</div>
<?php
}