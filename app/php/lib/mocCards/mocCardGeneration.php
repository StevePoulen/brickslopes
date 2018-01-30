<?php
    class mocCardGeneration {
        public function __construct() {
            $this->imageWidth = 3300;
            $this->imageHeight = 2550;
            $this->cards = 3;
            $this->margin = 10;
            $this->top_margin = 150;
            $this->left_margin = 150;
            $this->rounded_corners = 10;
            $this->createImage();
        }

        private function getBlackColor() {
            return imagecolorallocate($this->image, 0, 0, 0);
        }

        private function getWhiteColor() {
            return imagecolorallocate($this->image, 255, 255, 255);
        }

        private function getTransparentColor() {
            return imagecolorallocatealpha($this->image, 0, 0, 0, 127);
        }

        private function getActualMargin() {
            return $this->margin;
        }

        private function getTopMargin() {
            return $this->top_margin;
        }

        private function getLeftMargin() {
            return $this->left_margin;
        }

        private function getRightMargin() {
            return $this->imageWidth - $this->getLeftMargin();
        }

        private function getBottomMargin() {
            return $this->imageHeight - $this->getTopMargin();
        }

        private function resizeImage($logoName) {
            $image_size = getimagesize($logoName);
            $width_resize = ($this->getCardWidth() - ($this->rounded_corners * 2 - 1)) / $image_size[0];
            return array($image_size[0] * $width_resize, $image_size[1] * $width_resize, $image_size[0], $image_size[1]);
        }

        private function setLogo() {
            $logoName = '../../images/publicPics/banners/bs-2018-horizontal-banner.png';
            $logo = imagecreatefrompng($logoName);
            list($new_width, $new_height, $original_width, $original_height) = $this->resizeImage($logoName);

            for($index = 0; $index < $this->cards; $index++) {
                $cardObject = $this->getCardObject($index);
                imagecopyresampled($this->image,$logo,$cardObject['left_bottom_x'] + $this->rounded_corners, $cardObject['left_bottom_y'] - $new_height - ($this->rounded_corners - 2), 0, 0, $new_width, $new_height, $original_width, $original_height);
            }
        }

        private function getCardWidth() {
            return (($this->getRightMargin() - $this->getLeftMargin()) / $this->cards) - ($this->getActualMargin() * 2);
        }

        private function getCardObject($cardNumber) {
            if($cardNumber == 0) {
                $margin_count = 0;
            } else {
                $margin_count = 2;
            }

            $left_x = $this->getLeftMargin() + ($this->getCardWidth() * $cardNumber) + ($this->getActualMargin() * $margin_count * $cardNumber);
            $right_x = $left_x + $this->getCardWidth();
            return array (
                'left_top_x' => $left_x,
                'left_top_y' => $this->getTopMargin(),
                'left_bottom_x' => $left_x,
                'left_bottom_y' => $this->getBottomMargin(),
                'right_top_x' => $right_x,
                'right_top_y' => $this->getTopMargin(),
                'right_bottom_x' => $right_x,
                'right_bottom_y' => $this->getBottomMargin()
            );
        }

        private function setDottedLine() {
            $style = Array(
                $this->getBlackColor(),
                $this->getBlackColor(),
                $this->getBlackColor(),
                $this->getBlackColor(),
                IMG_COLOR_TRANSPARENT,
                IMG_COLOR_TRANSPARENT,
                IMG_COLOR_TRANSPARENT,
                IMG_COLOR_TRANSPARENT
            );

            imagesetstyle($this->image, $style);
        }

        private function setSolidLine() {
            $style = Array(
                $this->getBlackColor()
            );

            imagesetstyle($this->image, $style);
        }

        private function setCutLines() {
            $this->setDottedLine();

            imageline($this->image, $this->getLeftMargin(), $this->getTopMargin(), $this->getRightMargin(), $this->getTopMargin(), IMG_COLOR_STYLED);
            for($index = 0; $index < $this->cards; $index++) {
                $cardObject = $this->getCardObject($index);
                imageline($this->image, $cardObject['left_top_x'], $cardObject['left_top_y'], $cardObject['left_bottom_x'], $cardObject['left_bottom_y'], IMG_COLOR_STYLED);
                imageline($this->image, $cardObject['right_top_x'], $cardObject['right_top_y'], $cardObject['right_bottom_x'], $cardObject['right_bottom_y'], IMG_COLOR_STYLED);
            }
            imageline($this->image, $this->getLeftMargin(), $this->getBottomMargin(), $this->getRightMargin(), $this->getBottomMargin(), IMG_COLOR_STYLED);
        }

        private function createImage() {
            $this->image = imagecreatetruecolor(3300, 2550);
            imagesavealpha($this->image, true);
        }


        private function imageRectangleWithRoundedCorners($x1, $y1, $x2, $y2, $radius, $color) {
            // draw rectangle without corners
            imagefilledrectangle($this->image, $x1+$radius, $y1, $x2-$radius, $y2, $color);
            imagefilledrectangle($this->image, $x1, $y1+$radius, $x2, $y2-$radius, $color);
            // draw circled corners
            imagefilledellipse($this->image, $x1+$radius, $y1+$radius, $radius*2, $radius*2, $color);
            imagefilledellipse($this->image, $x2-$radius, $y1+$radius, $radius*2, $radius*2, $color);
            imagefilledellipse($this->image, $x1+$radius, $y2-$radius, $radius*2, $radius*2, $color);
            imagefilledellipse($this->image, $x2-$radius, $y2-$radius, $radius*2, $radius*2, $color);

            imagefilledrectangle($this->image, $x1+$radius, $y1+$radius, $x2-$radius, $y2-$radius, $this->getWhiteColor());
        }

        private function setRoundedCorners() {
            for($index = 0; $index < $this->cards; $index++) {
                $cardObject = $this->getCardObject($index);
                $mid_point = $cardObject['left_top_y'] - (($cardObject['left_top_y'] - $cardObject['right_bottom_y']) / 2);
                $this->imageRectangleWithRoundedCorners($cardObject['left_top_x'], $mid_point, $cardObject['right_bottom_x'],$cardObject['right_bottom_y'], $this->rounded_corners, $this->getBlackColor());
            }
        }

        private function addFont() {
            $text = 'Testing...';
            // Replace path by your own font path
            $font = './fonts/fontawesome-webfont.ttf';

            //$fontInt = imageloadfont($font);

            // Add some shadow to the text
            imagettftext($this->image, 20, 0, 11, 21, $this->getBlackColor(), $font, $text);
            //imagestring($this->image, $fontInt, 10, 10, 'Hello', $this->getBlackColor());
        }

        public function buildImage($fileName) {
            imagefill($this->image, 0, 0, $this->getTransparentColor());

            $white = imagecolorallocate($this->image, 255, 255, 255);
            // Draw a white rectangle
            imagefilledrectangle($this->image, $this->getLeftMargin(), $this->getTopMargin(), $this->getRightMargin(), $this->getBottomMargin(), $this->getWhiteColor());

            $this->setCutLines();
            $this->setRoundedCorners();

            $this->setLogo();
            $this->addFont();
            imagepng($this->image, $fileName . '.png');
        }
    }

    $mocCard = new mocCardGeneration();
    //$mocCard->buildImage('myfile');
    //exec('phantomjs ../../lib/rasterize.js ../../lib/index.html ../../lib/index.pdf A4');
    exec('phantomjs ../../lib/rasterize.js http://mybrickslopes.com/index.html ../../lib/index.pdf A4');
?>
