import { dom, text, getTree, getSecretURL, updateSecretURL, updateTree, createExpandCollapseCallback, getExpanded, getNonce, stripTags } from './framework.js';

export function ui( tree, url, expanded, element ) {
	url = getSecretURL();

	/*
    * @author Rajat Pal 
    * added below code as when someone is viewing chart via secret url he/she should see the save button and sharing url
    */
	var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);	
	var url_tree = urlParams.get('tree');
	
	if(url_tree){
		element.parentNode.replaceChild(
			dom( 'div', { id: 'ui' },
				expandCollapseButton(),
				domTree( tree ),
				'',//domSecretURL( url ),
				'',/*dom( 'button', { 'style': 'margin-top: 24px;', 'click': save, 'id':'chart_save_btn' },//rajat pal
					text( '✅ Save' )
				),*/
				//text( '(working on this.)' )//rajat pal not needed now as data is getting save in db
			),
			element
		);
	}else{
		element.parentNode.replaceChild(
			dom( 'div', { id: 'ui' },
				expandCollapseButton(),
				domTree( tree ),
				domSecretURL( url ),
				dom( 'button', { 'style': 'margin-top: 24px;', 'click': save, 'id':'chart_save_btn' },//rajat pal
					text( '✅ Save' )
				),
				//text( '(working on this.)' )//rajat pal not needed now as data is getting save in db
			),
			element
		);
	}
}

function save() {
	const form = dom( 'form', { 'method': 'POST', 'action': '' },
		dom( 'input', { 'name': 'tree', 'type': 'hidden', 'value': JSON.stringify( getTree() ) } ),
		dom( 'input', { 'name': 'key', 'type': 'hidden', 'value': JSON.stringify( getSecretURL() ) } ),
		dom( 'input', { 'name': 'nonce', 'type': 'hidden', 'value': getNonce() } )
	);
	document.body.appendChild( form );
	//form.submit();rajat pal
	//below ajax written by rajat pal to save data in DB
	var org_tree = jQuery("input[name=tree]").val();
	var secret_key = jQuery("input[name=key]").val();
	jQuery.ajax({
        type: 'POST',
        url: "admin-ajax.php",
	    data: {action: "savedata", "org_tree":org_tree,"secret_key":secret_key},               
        success: function(data){
         var data = JSON.parse(data);
         if(data.status){
         	alert(data.msg);
         	window.location.reload();
         }
        }
    });
}

function askUserForTeamDetails() {
	const emoji = stripTags( prompt( 'Enter new team’s emoji:' ) );
	if ( null === emoji ) {
		return false;
	}
	const name = stripTags( prompt( 'Enter new team’s name:' ) );
	if ( null === name ) {
		return false;
	}
	return { name, emoji };
}

function askUserForDeleteConfirmation() {
	return confirm( 'Are you sure you want to delete the team and all of its subteams?' );
}

function expandCollapseButton() {
	const expanded = getExpanded();
	const expandCollapse = createExpandCollapseCallback( '#ui > .team', '.children', 1500 );
	return dom( 'button', { 'style': 'margin-bottom: 24px;', 'click': expandCollapse },
		text( ( expanded ? 'Collapse' : 'Expand' ) + ' tree' )
	);
}

function domTree( team, level = 0 ) {
	const expanded = getExpanded();
	return dom( 'div',
			{ 'class': 'team', 'style': `padding-left: ${ level * 20 }px; overflow: hidden; position: relative;` },
		dom( 'div', { 'class': 'entry', 'style': 'z-index: 2; position: relative; background: #f1f1f1;' },
			dom( 'span', { 'style': 'font-size: 3em;' },
				text( team.emoji )
			),
			text( ` ${team.name} ` ),
			dom( 'button', { 'click': () => {
				const userDetails = askUserForTeamDetails();
				if(false === userDetails) return;
				
				const size = document.getElementsByClassName('entry').length + 1;
				const userDetailsNew = {
					id: size,
					name: userDetails.name,
					emoji: userDetails.emoji,
					parent_id: team.id,
					children: []
				};
				team.children = [ ...team.children, userDetailsNew ];
				updateTree(getTree());
			}, 'title': 'Add subteam' },
				text( '➕' )
			),
			dom( 'button', { 'click': () => {
				const status = askUserForDeleteConfirmation();
				if(true !== status) return;

				team.children = [];
				updateTree(getTree());
			}, 'title': 'Delete subteam' },
				text( '🚫' )
			),
		),
		dom( 'div', { 'class': 'children', 'style': 'z-index: 1; position: relative; display: ' + ( expanded ? 'block' : 'none' ) },
				...Object.keys( team.children).map( id => domTree( team.children[id], level + 1 ) ) )
	);
}

function domSecretURL( url ) {
	url = getSecretURL();
	return (
		dom( 'p', {},
			text( 'Secret URL to share: ' ),
			dom( 'strong', {'id':'sharing_secret_url'},//rajat pal to give id so that after ajax success we can change 
				text( url? url : 'will be regenerated on save (not yet implemented)' )
			),
			text( ' ' ),
			url ?
				//dom( 'button', { 'click': () => updateSecretURL( url ), 'title': 'Regenerate' },rajat pal calling my own function
				dom( 'button', { 'click': () => saveSecretUrl( url ), 'title': 'Regenerate' },
					text( '🔁' )
				)
			:   null
		)
	);
}
/*
* @author rajat pal
* this function saves the new secret key in DB and gives the new sharing url
*/ 
function saveSecretUrl(){
	const sharing_secret_url = getSecretURL();
	jQuery.ajax({
        type: 'POST',
        url: "admin-ajax.php",
	    data: {action: "savesecreturl", "url":sharing_secret_url},               
        success: function(data){
         var data = JSON.parse(data);
         if(data.status){
         	var sharing_url = data.sharing_url;
         	jQuery('#sharing_secret_url').html(sharing_url);	
         }
        }
    });
}