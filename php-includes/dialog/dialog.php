<section class="section--with-background section--with-color-fill section--dialog">
    <div class="section-color-fill"></div>
    <div class="section-header">
        <h1>
            Het meeste aanbod kantoren, bedrijfsruimten en winkels
        </h1>
        <h2>Vindt u op Ventu</h2>
    </div>

    <div class="dialog__container">
        <div class="scene">
            <div class="cube">
                <div class="cube__face cube__face--front">
                    <?php include('dialog-flow.php'); ?>
                </div>
                <div class="cube__face cube__face--back">
                    <?php include('dialog-classic.php'); ?>
                </div>
                <div class="cube__face cube__face--right">

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
    $(window).ready(function(){
        $('.dialog__switch').click(function(){
            $('.section--dialog .cube').toggleClass('cube--rotated');
        });

        resizeCube();
    });

    $(window).resize(function(){
        resizeCube();
    });

    (function() {
        var node = document.createElement('style');
        document.body.appendChild(node);
        window.addStyleString = function(str) {
            node.innerHTML = str;
        }
    }());

    function getCubeStyle(size) {
        var cubeStyle = '';
        cubeStyle += '.scene { width: ' + size + 'px; height: ' + size + 'px; perspective: ' + size + 'px;}';
        cubeStyle += '.scene .cube { width: ' + size + 'px; height: ' + size + 'px; transform: translateZ(-' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face { width: ' + size + 'px; height: ' + size + 'px;}';
        cubeStyle += '.scene .cube .cube__face.cube__face--front    { transform: rotateY(  0deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face.cube__face--right    { transform: rotateY( 90deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face.cube__face--back     { transform: rotateY(180deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face.cube__face--left     { transform: rotateY(-90deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face.cube__face--top      { transform: rotateX( 90deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube .cube__face.cube__face--bottom   { transform: rotateX(-90deg) translateZ(' + (0.5 * size) + 'px);}';
        cubeStyle += '.scene .cube.cube--rotated   { transform: translateZ(-' + (0.5 * size) + 'px) rotateY( 180deg);}';
        return cubeStyle;
    }


    function resizeCube() {
        var windowWidth, cubeWidth, newStyle;
        windowWidth = $(window).outerWidth();
        if (windowWidth < 640) {
            cubeWidth = windowWidth - 40;
            newStyle = getCubeStyle(cubeWidth);
            addStyleString(newStyle);
        } else {
            // clear previous made cube styles
            // so it will fallback to the css in style.css
            addStyleString('');
        }
    }



</script>

