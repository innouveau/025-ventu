<section class="section--with-background section--with-color-fill section--dialog">
    <div class="section-color-fill"></div>
    <div class="section-header">
        <h1>
            Het meeste aanbod kantoren, bedrijfsruimten en winkels
        </h1>
        <h2>Vindt u op Ventu</h2>
    </div>

    <button id="dialog__switch">Switch dialog (temp button)</button>

    <div class="dialog__container">
        <div class="scene">
            <div class="cube">
                <div class="cube__face cube__face--front">
                    <?php include('dialog-flow.php'); ?>
                </div>
                <div class="cube__face cube__face--back"></div>
                <div class="cube__face cube__face--right">
                    <?php include('dialog-classic.php'); ?>
                </div>
                <div class="cube__face cube__face--left"></div>
                <div class="cube__face cube__face--top"></div>
                <div class="cube__face cube__face--bottom"></div>
              </div>
        </div>


    </div>

    <div class="ventu-continue">
        <div class="ventu-continue-button"></div>
        <div class="ventu-continue-text">
            Met 38.240 panden het grootste aanbod van Nederland
        </div>
    </div>
</section>

<script>
    $('#dialog__switch').click(function(){
        $('.section--dialog .cube').toggleClass('cube--rotated');
    });
</script>

