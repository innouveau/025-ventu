<div id="ventu-filters" class="ventu-slide-panel">
    <div class="ventu-slide-panel-label"></div>

    <div class="ventu-slide-panel-content">

        <div id="ventu-filter-content">
            <div id="ventu-filter-header-section" class="ventu-filter-section">
                <div id="ventu-filter-button-close" class="ventu-popup-close" onclick="ventu.closeFilter()"></div>
                <h5>
                    <span id="ventu-filter-result">329</span> <span>objecten gevonden</span>
                </h5>
            </div>

            <!-- location -->
            <div id="ventu-filter-location" class="ventu-filter-section">
                <div class="ventu-filter-header">
                    Zoekopdracht:
                </div>
                <div class="ventu-filter-label-container">
                    <div class="ventu-filter-label">
                        Amsterdam
                    </div>
                </div>

                <div class="ventu-filter-full-text-container">
                    <div class="ventu-filter-full-text">

                    </div>
                </div>
            </div>

            <!-- types -->
            <div id="ventu-filter-types" class="ventu-filter-section">
                <div class="ventu-filter-header">
                    Type object:
                    <div class="ventu-filter-read-more">
                        <div class="ventu-filter-read-more-label">
                            <span class="ventu-filter-read-more-label--close">Meer</span>
                            <span class="ventu-filter-read-more-label--open">Minder</span>
                        </div>
                    </div>
                </div>
                <div class="ventu-filter-label-container">
                    <div class="ventu-filter-label">
                        Winkel
                    </div>
                    <div class="ventu-filter-label">
                        Kantoor
                    </div>
                </div>

                <div class="ventu-filter-full-text-container">
                    <div class="ventu-filter-full-text">
                        <div id="ventu-filter-types-buttons"><!-- appended dynamically --></div>

                    </div>
                </div>
            </div>

            <!-- area -->
            <div id="ventu-filter-area" class="ventu-filter-section">
                <div class="ventu-filter-header">
                    Oppervlakte:
                    <div class="ventu-filter-read-more">
                        <div class="ventu-filter-read-more-label">
                            <span class="ventu-filter-read-more-label--close">Meer</span>
                            <span class="ventu-filter-read-more-label--open">Minder</span>
                        </div>
                    </div>
                </div>
                <div class="ventu-filter-label-container">
                    van
                    <div id="ventu-filter-area-min" class="ventu-filter-label">
                        140 m²
                    </div>
                    tot
                    <div id="ventu-filter-area-max" class="ventu-filter-label">
                        250 m²
                    </div>
                </div>

                <div class="ventu-filter-full-text-container">
                    <div class="ventu-filter-full-text">
                        van
                        <div class="ventu-filter-area-box">
                            min
                            <input id="ventu-filter-area-min-input">
                            m²
                        </div>
                        tot
                        <div class="ventu-filter-area-box">
                            max
                            <input id="ventu-filter-area-max-input">
                            m²
                        </div>
                    </div>
                </div>
            </div>

            <!-- transaction -->
            <div id="ventu-filter-transaction" class="ventu-filter-section">
                <div class="ventu-filter-header">
                    Aanbod:
                    <div class="ventu-filter-read-more">
                        <div class="ventu-filter-read-more-label">
                            <span class="ventu-filter-read-more-label--close">Meer</span>
                            <span class="ventu-filter-read-more-label--open">Minder</span>
                        </div>
                    </div>
                </div>
                <div class="ventu-filter-label-container">
                    <div class="ventu-filter-label">
                        Huren
                    </div>
                </div>

                <div class="ventu-filter-full-text-container">
                    <div class="ventu-filter-full-text">
                        <div id="ventu-filter-transaction-buttons"><!-- appended dynamically --></div>
                    </div>
                </div>
            </div>

            <!-- search-area -->
            <div id="ventu-filter-search-type" class="ventu-filter-section">
                <div class="ventu-filter-header">
                    Aangepast zoekgebied:
                    <div class="ventu-filter-read-more">
                        <div class="ventu-filter-read-more-label">
                            <span class="ventu-filter-read-more-label--close">Meer</span>
                            <span class="ventu-filter-read-more-label--open">Minder</span>
                        </div>
                    </div>
                </div>
                <div class="ventu-filter-label-container">

                </div>

                <div class="ventu-filter-full-text-container">
                    <div class="ventu-filter-full-text">
                        Door het toevoegen van een zoekcircel wordt er in een
                        straal van de ingestelde afstand gezocht rondom de huidige
                        locatie (de cirkel kan met de hand verplaatst en vergroot worden):

                        <div class="ventu-filter-search-type-button ventu-filter-search-type-button--none" search-type="none">
                            <div class="ventu-filter-search-type-icon">
                                <span>Geen aangepast zoekgebied</span>
                            </div>
                        </div>
                        <div class="ventu-filter-search-type-button ventu-filter-search-type-button--circle" search-type="circle">
                            <div class="ventu-filter-search-type-icon"></div>
                            <div class="ventu-filter-search-type-label">
                                <span>Cirkel</span>
                                <input type="text" id="ventu-filter-search-type-cirkel" value="0">
                                <span>km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>




        <!-- tools -->
        <div id="ventu-filter-tools">
            <div class="ventu-tools-button ventu-tools-button--save">
                <div class="ventu-tools-button-icon"></div>
                <div class="ventu-tools-button-label">
                    Sla deze zoekopdracht op
                </div>
            </div>
            <div class="ventu-tools-button ventu-tools-button--erase">
                <div class="ventu-tools-button-icon"></div>
                <div class="ventu-tools-button-label">
                    Wis alle filters
                </div>
            </div>
        </div>
    </div>

</div>