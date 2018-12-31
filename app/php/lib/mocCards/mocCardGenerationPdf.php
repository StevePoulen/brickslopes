<?php
    require_once (__DIR__ . '/../../../../config/config.php');
    require_once (__DIR__ . '/../logging.php');
    require_once (__DIR__ . '/../db.php');
    require_once (__DIR__ . '/../../models/mocModel.php');

    class mocCardGeneration {
        public function __construct() {
            $this->eventId = 6;
            $this->mocObj = new mocModel();
            $this->mocs = array();
            $this->buildMocs();
        }

        private function addBlanks() {
            $mod = sizeof($this->mocs) % 3;
            $blanks = 33 - $mod;
            for ($i = 0; $i<$blanks; $i++) {
                array_push (
                    $this->mocs,
                    array (
                        'title' => "",
                        'displayName' => "",
                        'description' => "",
                        'theme' => ""
                    )
                );
            }
        }

        private function buildMocs() {
            $this->mocObj->getMocInformation($this->eventId);
            if ($this->mocObj->result) {
                while($dbObj = $this->mocObj->result->fetch_object()) {
                    array_push (
                        $this->mocs,
                        array (
                            'mocId' => $dbObj->mocId,
                            'eventId' => $dbObj->eventId,
                            'userId' => $dbObj->userId,
                            'themeId' => $dbObj->themeId,
                            'title' => $dbObj->title,
                            'displayName' => $dbObj->displayName,
                            'mocImageUrl' => $dbObj->mocImageUrl,
                            'baseplateWidth' => $dbObj->baseplateWidth,
                            'baseplateDepth' => $dbObj->baseplateDepth,
                            'description' => $dbObj->description,
                            'isTfol' => $dbObj->isTfol,
                            'isSet' => $dbObj->isSet,
                            'theme' => $dbObj->theme
                        )
                    );
                }
            }

            $this->addBlanks();
        }

        public function buildImage($fileName) {
            function getPageMargin() {
                return 50;
            }

            $page_margin = getPageMargin();
            $page_margin_display = $page_margin . 'px';

            //$page_width = 3508 - $page_margin * 2;
            $page_width = 842 - $page_margin * 2;
            $page_width_display = $page_width . 'px';

            function getPageHeight() {
                //return 2480 - getPageMargin() * 2;
                return 595 - getPageMargin();
            }

            $page_height = getPageHeight();
            $page_height_display = $page_height . 'px';

            $card_margin = 0;
            $card_margin_display = $card_margin . 'px';

            $card_height = $page_height;
            $card_height_display = $card_height . 'px';

            $card_border = 1;
            $card_border_display = $card_border . 'px';

            $card_front_border = 3;
            $card_front_border_display = $card_front_border . 'px';

            $card_width = $page_width / 3 - ($card_border * 2);
            $card_width_display = $card_width . 'px';
            $card_width_half = ($card_width - 4) / 2;
            $card_width_half_display = $card_width_half . 'px';

            $indent_margin = 10;
            $indent_margin_display = $indent_margin . 'px';

            $card_inner_width = $card_width - ($indent_margin * 2 + $card_front_border * 2);
            $card_inner_width_display = $card_inner_width . 'px';

            $card_back_height = $card_height / 2 - 5;
            $card_back_height_display = $card_back_height . 'px';

            $card_front_height = $card_height / 2;
            $card_front_height_display = $card_front_height . 'px';

            function getBannerHeight($bannerWidth) {
                return $bannerWidth / 3.6;
                //return getPageHeight() * .13;
            }

            $banner_width = $card_width - ($card_front_border * 2);
            $banner_width_display = $banner_width . 'px';

            $banner_height = getBannerHeight($banner_width);
            $banner_height_display = $banner_height . 'px';

            function getFrontMargin() {
                return 5;
            }

            $front_margin = getFrontMargin();
            $front_margin_display = $front_margin . 'px';

            function calculateFrontHeight($percentage, $height, $bannerWidth) {
                return ($height - getBannerHeight($bannerWidth) - getFrontMargin() * 3) * $percentage;
            }

            $description_height = calculateFrontHeight(.5, $card_front_height, $banner_width);
            $description_height_display = $description_height . 'px';

            $minor_details_height = calculateFrontHeight(.1, $card_front_height, $banner_width);
            $minor_details_height_display = $minor_details_height . 'px';

            $title_height = calculateFrontHeight(.3, $card_front_height, $banner_width);
            $title_height_display = $title_height . 'px';

            $theme_height = calculateFrontHeight(.1, $card_front_height, $banner_width);
            $theme_height_display = $theme_height . 'px';

            $counter = 1;
            $total_counter = 0;
            $file_suffix = 1;
            $total_mocs = sizeof($this->mocs);
            $total_files = ceil($total_mocs / 3);
            echo "Total number of mocs: $total_mocs\n\n";
            echo "Total expected files: $total_files\n\n";
            foreach($this->mocs as $moc) {
                $html = "
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial;
                                    font-size: 16px;
                                }

                               .printMocsDashboard {
                                   width: $page_width_display;
                                   height: $page_height_display;
                               }

                               .printMocContainer {
                                   position: relative;
                                   float: left;
                                   width: $card_width_display;
                                   height: $card_height_display;
                                   background-color: #fff;
                                   color: #000;
                                   border-left: $card_border_display dotted #000;
                                   margin-left: $card_margin_display;
                               }

                               .back {
                                   position: relative;
                                   height: $card_back_height_display;
                                   width: $card_inner_width_display;
                               }

                               .front {
                                   position: relative;
                                   padding-left: $indent_margin_display;
                                   padding-right: $indent_margin_display;
                                   height: $card_front_height_display;
                                   width: $card_inner_width_display;
                                   border: $card_front_border_display solid #000;
                                   border-radius: 10px;

                                   text-align: center;
                               }

                               .title {
                                   position: relative;
                                   margin-top: $front_margin_display;

                                   width: $card_inner_width_display;
                                   height: $title_height_display;

                                   text-align: center;
                                   font-size: 1em;
                                   white-space: normal;
                                   word-wrap: break-word;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                               }

                               .bold {
                                   font-weight: bold;
                               }

                               .description {
                                   position: relative;
                                   width: $card_inner_width_display;
                                   text-align: center;
                                   font-size: 1em;
                                   white-space: normal;
                                   word-wrap: break-word;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                                   height: $description_height_display;
                                   margin-top: $front_margin_display;
                               }

                               .minorDetails {
                                   position: relative;
                                   width: $card_inner_width_display;
                                   text-align: center;
                                   font-size: 1em;
                                   white-space: normal;
                                   word-wrap: break-word;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                                   height: $minor_details_height_display;
                                   margin-top: $front_margin_display;
                               }

                               .minorDetails .minorDetailYear {
                                   position: absolute;
                                   left: 0px;
                                   width: $card_width_half_display;
                                   font-style: italic;
                                   text-align: left;
                               }

                               .minorDetails .minorDetailNumber {
                                   position: absolute;
                                   right: 0px;
                                   width: $card_width_half_display;
                                   text-align: right;
                               }

                               .mocTheme {
                                   position: relative;
                                   margin-top: $front_margin_display;
                                   width: $card_inner_width_display;
                                   text-align: center;
                                   font-size: 1em;
                                   white-space: normal;
                                   word-wrap: break-word;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                                   height: $theme_height_display;
                                   font-style: italic;
                               }

                               .banner {
                                   position: relative;
                                   width: $banner_width_display;
                                   left: -$indent_margin_display;
                               }

                               .bannerImage {
                                   width: $banner_width_display;
                                   border-radius: 0 0 5px 5px;
                               }
                        </style>
                    </head>
                    <body>
                        <div class='printMocsDashboard'>
                ";
                if ($counter === 1) {
                    $myFile = fopen($fileName, "w") or die("Unable to open file!");
                    fwrite($myFile, $html);
                }

                $moc_number = $total_counter + 1;

                $title = $moc['title'] == "" ? '' : "\"{$moc['title']}\"";
                $builder = $moc['displayName'] == "" ? '' : "by {$moc['displayName']}";
                $isTfol = $moc['isTfol'] == "true" ? 'T' : '';
                $isSet = $moc['isSet'] == "true" ? 'S' : '';

                $txt = "
                    <div class='printMocContainer'>
                        <div class='back'></div>
                        <div class='front'>
                            <div class='title'>
                                <span class='bold'>$title</span>
                                <div>$builder</div>
                            </div>
                            <div class='description'>{$moc['description']}</div>
                            <div class='mocTheme'>{$moc['theme']}</div>
                            <div class='minorDetails'>
                                <div class='minorDetailYear'>
                                    2019
                                </div>
                                <div class='minorDetailNumber'>
                                    <span>{$isSet}</span>
                                    &nbsp;
                                    <span>{$isTfol}</span>
                                    &nbsp;
                                    <span>#{$moc_number}</span>
                                </div>
                            </div>
                            <div class='banner'>
                                <img class='bannerImage' src='../../../../images/publicPics/banners/bs-2018-horizontal-banner.png'></img>
                            </div>
                        </div>
                    </div>
                ";
                fwrite($myFile, $txt);
                $total_counter++;

                if ($counter === 3 || $total_counter === $total_mocs) {
                    $html = "
                                </div>
                            </body>
                        </html>
                    ";
                    fwrite($myFile, $html);
                }

                $counter++;

                if ($counter === 4 || $total_counter === $total_mocs) {
                    $counter = 1;
                    fclose($myFile);
                    $pdfFileName = "mocPrintOffs/index_" . $file_suffix . ".pdf";
                    exec('phantomjs rasterize.js ' . $fileName . ' ' . $pdfFileName);
                    $file_suffix++;
                    echo "$pdfFileName => ($total_counter/$total_mocs)\n";
                }
            }
        }
    }

    $mocCard = new mocCardGeneration();
    $mocCard->buildImage('mocPrintOffs/template.html');
?>
