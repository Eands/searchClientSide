<?php
require_once('libs/php4-html-dom.php');
require_once('libs/json.php');
ini_set('max_execution_time', 600); //if to slow

$folders = array(glob('../RU/*.html'), glob('../EN/*.html'));
$fileDest = '../data/data.json';

if (!function_exists('file_put_contents')) {
    function file_put_contents($filename, $data, $flags = 0) {
        if (is_array($data)) {
            $data = implode('', $data);
        }
        $flags = (int)$flags;
        $mode = ($flags & FILE_APPEND) ? 'ab' : 'wb';
        $use_include_path = (bool)($flags & FILE_USE_INCLUDE_PATH);
        if ($fp = fopen("$filename", $mode, $use_include_path)) {
            if ($flags & LOCK_EX) {
                if (!flock($fp, LOCK_EX)) {
                    fclose($fp);
                    return false;
                }
            }
            $bytes = fwrite($fp, "$data");
            if ($flags & LOCK_EX) {
                flock($fp, LOCK_UN);
            }
            fclose($fp);
            return $bytes;
        } else {
            return false;
        }
    }
}

function trim_all($str, $what = null, $with = ' ') {
    if ($what === null) {
        $what = "\\x00-\\x20";
    }
    return trim(preg_replace("/[" . $what . "]+/", $with, $str), $what);
}

function removeHtmlComments($str) {
    $pattern = '/(<!--.*?-->)/s';
    return preg_replace($pattern, '', $str);
}

function convertToUtf8FromCp1251($str) {
    return mb_convert_encoding($str, 'utf-8', 'cp1251');
}

echo 'Добавленные страницы: <br>';
$articles = array();
foreach ($folders as $files) {
    foreach ($files as $file) {
        if ($file != '../RU/jrn__.html') {
            $content = file_get_contents($file);
            $htmlParser = new htmlParser();
            $htmlParser->parse($content);

            $parseTest = $htmlParser->getElementById('post');
            if (!is_null($parseTest)) {
                $titleNode = $parseTest->findNodeByAttributeDown('class', 'title');
                $descriptionNode = $parseTest->findNodeByAttributeDown('class', 'entry');
                if(!is_null($titleNode) && !is_null($descriptionNode)) {
                    $tmp['title'] = trim_all(convertToUtf8FromCp1251(removeHtmlComments($titleNode->getText())));
                    $tmp['description'] = trim_all(convertToUtf8FromCp1251(removeHtmlComments($descriptionNode->getText())));
                    $tmp['url'] = $_SERVER['SERVER_NAME'] . '/' . $file;
                }
            }

            /*$controls = $htmlParser->getElementsByTagName('div');
            if (!is_null($controls)) {
                foreach ($controls as $control) {
                    if ($control->getAttribute('class') === 'title') {
                        $tmp['title'] = trim_all(convertToUtf8FromCp1251(removeHtmlComments($control->getText())));
                        $tmp['url'] = $_SERVER['SERVER_NAME'] . '/' . $file;
                    } else if ($control->getAttribute('class') === 'entry') {
                        $tmp['description'] = trim_all(convertToUtf8FromCp1251(removeHtmlComments($control->getText())));
                    }
                }
            }*/
            echo $file . '<br>';
            array_push($articles, $tmp);
            //enable extension=php_mbstring.dll
        }
    }
}
$jsonServices = new Services_JSON();
$jsonData = $jsonServices->encode($articles);
file_put_contents($fileDest, $jsonData);
echo 'done';
