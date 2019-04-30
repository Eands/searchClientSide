<?php
// =========================================================================================================
/** 
 * Debug operations for php4-html-parser
 * change-history:
 * - <br><b>0.10.0</b>
 * - - <i>Added display of boolean attributes set to TRUE</i>
 * - <br><b>0.7.2</b>
 * - - <i>Added new positioning output with line numbers and line position</i>
 * - <br><b>0.3.0</b>
 * - - <i>Added output of debug table with tests/operations and results</i>
 * - <br><b>0.2.0</b>
 * - - <i>Added PhpDocumentor Comments</i>
 * - <br><b>0.1.0</b>
 * - - : <i>created initial version of printDebugInfo() to display DOM structure</i>
 * 
 * @author Adrian Meyer <adrian.meyer@unc.edu>
 * @package php4-html-dom
 * @category debug
 * @license Freeware
 * @version 0.2.0
 *
 */
// =========================================================================================================

// *************************************
/** 
 * Output the a style tag for the debug information
 * @package php4-html-dom
 * @access public
 */
// *************************************
function printDebugStyle() {
	echo '<style type="text/css">
	table.html-parser-info {
		font-family: Verdana;
		width: 100%;
		border-width: thin;
		border-style: solid;
		border-color: black;
		border-collapse: collapse;
	}
	table.html-parser-info th {
		font-size: normal;
		color: white;
		border-width: thin;
		border-style: solid;
		border-color: black;
		background-color: #CCC9A4;
		padding: 4px;
	}
	tr.html-parser-debug td {
		font-weight: bold;
		background-color: #FDFCF2;
		padding: 4px;
	}
	table.html-parser-info td {
		font-size: small;
		border-width: thin;
		border-style: solid;
		border-color: black;
		padding: 2px;
		vertical-align: top;
	}
	</style>';
}

// *************************************
/** 
 * Print a table with all the debug information
 * Example:
 * <code>
 * // a string containing some HTML
 * $someHtml = '<b>Hello</b>&nbsp;<i>world</i>!';
 * 
 * // parsing HTML
 * require_once('php4-html-dom.php');	
 * $htmlParser = new htmlParser();
 * $htmlParser->parse( $someHtml );
 * 
 * // debugging last parsing operation
 * require_once('php4-html-dom-debug.php');
 * printDebugStyle( $htmlParser );
 * printDebugInfo( $htmlParser );
 * </code>
 * @package php4-html-dom
 * @access public
 */
// *************************************
function printDebugInfo( $aParser ) {	
	echo "<table class=html-parser-info>";
	echo "<tr><th>Debug: Last parsed HTML</th><tr>";
	echo "<tr><td>".htmlspecialchars( $aParser->LastHtml )."</td><tr>";
	echo "</table><br>";

	echo "<table class=html-parser-info>";
	echo "<tr><th colspan=5>Debug: DOM Structure</th><tr>";
	echo "<tr class=html-parser-debug><td>HTML&nbsp;Tag</td><td>Tag&nbsp;Type</td><td>Level</td><td>Position</td><td>Tag Data</td><tr>";

	printDebugInfoNode( $aParser->RootNode );
	
	echo "</table>";
}

// *************************************
/** 
 * Recursive function to output information for each htmlNode
 * @package php4-html-dom
 * @access private
 */
// *************************************
function printDebugInfoNode( $aNode, $aLevel = -1 ) {
	$aLevel++;
	echo "<tr><td nowrap>".str_repeat( '&nbsp;&nbsp;', $aLevel );

	switch ($aNode->TagType) {
		case ttText: { 
			echo "<i>{text}</i>";
			break;
		}

		case ttRoot: { 
			echo "<i>{root}</i>";
			break;
		}

		default: { 
			echo "<b>&lt;{$aNode->TagName}";
			if ($aNode->TagType == ttSingle ) echo "/";
			echo "&gt;</b>";			
		} 			
	}
	echo "</td><td align=center>{$GLOBALS[gHtmlParser]['tagTypes'][$aNode->TagType]}</td>";
	echo "<td align=center>{$aLevel}</td>";
	echo "<td align=left nowrap>".$aNode->getParsePositionStr(false)."</td>";
	echo "<td width=100%>".htmlspecialchars( $aNode->TagData )."</td><tr>";

	// output attributes
	foreach( $aNode->Attributes as $name => $value ){
		echo "<tr><td nowrap>".str_repeat( '&nbsp;&nbsp;', $aLevel + 1 );
		echo "{$aNode->TagName}.{$name}";
		echo "</td><td align=center>ttAttribute</td>";
		echo "<td align=center>".($aLevel+1)."</td>";
		echo "<td align=left>-</td>";
		if (true===$value)
			echo '<td width=100%><i>{true}</i></td><tr>';
		else
		if (is_null($value))
			echo '<td width=100%><i>{null}</i></td><tr>';
		else
			echo "<td width=100%>".htmlspecialchars( $value )."</td><tr>";
	}

	foreach( $aNode->ChildNodes as $node )
		printDebugInfoNode( $node, $aLevel );

	if ($aNode->TagType == ttNormal )
		echo '<tr><td>'.str_repeat( '&nbsp;&nbsp;', $aLevel )."<b>&lt;/{$aNode->TagName}&gt;</b></td><td colspan=5><tr>";

	$aLevel--;
}

// *************************************
/** 
 * Start a table containing debug operations
 * @package php4-html-dom
 * @access public
 */
// *************************************
function printDebugTableStart( $aTitle ) {	
	echo "<br><table class=html-parser-info>";
	echo "<tr><th colspan=2>{$aTitle}</th><tr>";
}

// *************************************
/** 
 * end a table end containing debug operations
 * @package php4-html-dom
 * @access public
 */
// *************************************
function printDebugTableOperation( $aOperation, $aResult ) {	
	echo "<tr><td>{$aOperation}</td><td>".htmlspecialchars( $aResult )."</td></tr>";
}

// *************************************
/** 
 * end a table end containing debug operations
 * @package php4-html-dom
 * @access public
 */
// *************************************
function printDebugTableEnd() {	
	echo "</table";
}


?>