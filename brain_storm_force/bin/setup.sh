set -e

# Cleanup, because not all commands play well with already existing directories
rm -rf $LANDO_WEBROOT
rm -rf $WP_TESTS_DIR
echo Y | mysqladmin -u$DB_USER -p$DB_PASS -h$DB_HOST drop $DB_NAME
mysqladmin -u$DB_USER -p$DB_PASS -h$DB_HOST create $DB_NAME

# Install and configure WordPress
WP_VERSION=`curl -L http://api.wordpress.org/core/version-check/1.7/ | perl -ne '/"version":\s*"([\d\.]+)"/; print $1;'`
cd $LANDO_MOUNT
wp core download --path=$LANDO_WEBROOT --version=$WP_VERSION
wp config create \
	--path=$LANDO_WEBROOT \
	--dbname=$DB_NAME \
	--dbuser=$DB_USER \
	--dbpass=$DB_PASS \
	--dbhost=$DB_HOST
wp config set \
	--path=$LANDO_WEBROOT \
	--type=constant \
	--raw \
	WP_DEBUG true
wp core install \
	--path=$LANDO_WEBROOT \
	--url="http://rustyincorgchartnikschavan.lndo.site" \
	'--title="Let’s Create an Org Chart"' \
	--admin_user="rusty" \
	--admin_password="rusty" \
	--admin_email="rusty@nikhilc.dev" \
	--skip-email

# Link our plugin
ln -sF $LANDO_MOUNT $LANDO_WEBROOT/wp-content/plugins/rusty-inc-org-chart
wp plugin activate rusty-inc-org-chart --path=$LANDO_WEBROOT

# Install tests infrastructure
# We could have installed the development version of WordPress, which includes the tests,
# but it would have required a build and a lot more mving around of directories
svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/includes/ $WP_TESTS_DIR/includes
svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/data/ $WP_TESTS_DIR/data
ln -sf $LANDO_MOUNT/.wp-tests-config.php $WP_TESTS_DIR/wp-tests-config.php
