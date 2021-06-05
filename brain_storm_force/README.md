# 👋💻😅 Welcome to Coding Challenge
The interview was fun, right? We’re excited to welcome you to the next stage – you earned it. Now it’s time to get started writing some code.

## 🐕 The Rusty Inc. Org Chart WordPress Plugin

Rusty Inc. is the leading corporation offering free benefits to both canine and human societies.

To improve their internal website, you will help them with the organizational chart editor and viewer. It’s implemented as a WordPress plugin. Activate the plugin and you will see a “Rusty Inc. Org Chart” item almost at the top of the menu.

Right now some of the functionality is missing and we need your help! Below are your tasks, **please answer any questions asked in GitHub issues.**

## 🤹 Your Tasks
* Implement the back-end save functionality: clicking “✅ Save” should persist the tree and regenerate the secret key if the user clicked on the regenerate button. Feel free to use functionality already in the plugin, like the `regenerate_key` method in `Rusty_Inc_Org_Chart_Sharing`.
* Perform a security audit on both the front-end and the backend of the plugin. Please, also add a short note on GitHub about how exactly would an attacker exploit each security problem that you found. Finding the security problems is a crucial part of this test, so it deserves a small hint – in the code you will find few classic OWASP Top 10 vulnerabilities, a logic error, and a problem only relevant if the plugin is installed on several sites. None of them are WordPress or PHP-specific.
* Find a way to speed up rendering the tree on the back-end: when the corporation grows and we reach more levels (try with each team having 3 sub-teams and 9 levels), rendering the tree starts taking too much time. The HTTP response for the plugin admin page should be a lot faster than a second. More importantly – how would you explain to the colleague who wrote it why was it so slow?

## ⏳ Time
* We ask that you spend **6 hours total** on this test (not counting any needed setup and/or research time) and that you complete it within **one week** of the test being sent to you. To be clear, please do not spend a full week of work on this and do not spend more than 6 hours. We don't want to take up too much of your time. If you find the test is taking more than the expected 6 hours, we've got some [additional tips in the FAQ](#its-taking-me-more-than-the-suggested-5-6-hours-what-should-i-do).
* As a tip, we recommend planning out your time to focus on different tasks before starting and adopt a “timeboxing” approach. To explain, timeboxing is the idea that instead of working on a task until it’s done, you commit to work on it for a specific amount of time instead. This should result in better focus, more free time for you, less opportunities for the plugin to become complex, and easier to avoid the inevitable rewrite-from-scratch tendencies (please, don't rewrite the whole plugin).
* When done, please ping us on Slack in the shared group channel. From there, we will organize a member of our team to review your work. 
* We understand that life happens! If you need more than a week to complete the test, don't worry, just ping us in Slack. 

## 🎹 Development
👷 Setting up a development environment with Lando

We’re experimenting with a system to make setting up all software needed for development easier. Lando is Docker-based, but should make things a bit easier than most Docker setups.

* Install [Lando](https://docs.devwithlando.io/). We've tested it up to RC7.
* Clone this repository locally. If you are using Windows, make sure you've set `git` to use UNIX line endings.
* In a terminal go to the directory of the local repository clone.
* Run `lando start`.
* Wait for a few minutes for everything to begin loading. Subsequent starts will be much faster but you’ll need to give it time for the very first start.
* You should see a `BOOMSHAKALAKA!!!` line 🎉
* In the `NGINX URLS` section of the output note the third URL (it should start with `http://rustyincorgchart.lndo.site` and maybe have a port).
* If the URL is different than `http://rustyincorgchart.lndo.site`, then run: `lando wp search-replace 'http://rustyincorgchart.lndo.site' '<URL>'`
* In order to visit the plugin’s interface, use the URL from above and append `/wp-admin/admin.php?page=rusty-inc-org-chart`, both the username and the password should be `rusty`.
* Logs are accessible via the [lando logs](https://docs.devwithlando.io/cli/logs.html) command. If you mostly care about PHP error log, a useful command is: `lando logs -s appserver -t -f`.

⏸ Debugging PHP with XDebug
* If using Lando, configure your IDE to listen to XDebug on port 9000 and map the server's `/app/` directory to the root of this repository.

⏱ Profiling PHP with XDebug
* If using Lando, simply append `XDEBUG_PROFILE` param to either GET or POST parameters. The profiler will write to the root of this repository.

🚧 Manually

If you’d rather set up everything yourself, here is what you’ll need to setup:
* A local WordPress installation.
* If you want to run the unit tests for the plugin, you will need also [phpunit + WordPress unit tests](https://make.wordpress.org/cli/handbook/plugin-unit-tests/).

👉 Process

* The final deliverable should be one or more [pull requests](https://help.github.com/articles/creating-a-pull-request/) in the repository.
* If it will help you, feel free to use the GitHub issues or project functionality, though it's not mandatory at all.
* If you have any questions, let us know, we'd be happy to be your both product and technical partner.

💉 Running tests:

* If using Lando you can run `lando phpunit` or `lando phpunit <php-file-with-tests>` in the main plugin directory.
* JavaScript tests: open `<URL-of-plugin-directory>/tests/test.html` in your browser.

💡 Helpful tips:

* Back-end entry point: have a look at `class-rusty-inc-org-chart-plugin.php` and the `add_init_action`.
* Front-end entry point: the bootstrap code is in `admin-page-inline-script.php`. Hydrating the UI is much easier through an inline script than via AJAX calls.

## ✅ What To Pay Attention To Besides The Tasks
* Simplicity – we would consider it a win if the code does not get more complex after adding more features and fixing issues.
* Make the changes easy to review – detailed pull request descriptions, small pull requests, commit granularity, descriptive commit messages.
* Design and code quality — separation of concerns, abstraction, naming…
* Backwards compatibility – if you make changes to how the plugin works, make sure users who have already installed it won’t have trouble upgrading.
* Browser compatibility – the plugin should work well under Edge 16+, Firefox 60+, Chrome 67+, Safari 11+.

## 😐 What To Not Pay Too Much Attention To
These are still important, but we thought for this test they would be a distraction:

* WordPress or PHP internals – the language should have familiar enough syntax and we have tried to put some extra pointers about how WordPress works. Ideally you shouldn't need more than a quick Google search to accomplish what you need. **This is not a test for your PHP or WordPress skills.**
* PHP minimum version – WordPress core still works on PHP 5.2 (ancient). On WordPress.com we run the latest PHP version, so no need to worry about that.
* Internationalization – normally a very important part of the development process, because it allows people from all over the world to use our software. However, in this case, it would add too much complexity, so we decided to omit it for now.
* Asset size and number of HTTP requests – another usually important consideration that we can forgo for now, because the plugin will be used in an intranet and under HTTP/2.

## 🙋 Frequently Asked Questions

### I found a problem. Is fixing it part of the task?
It depends on the severity of the problem and the available time. This will be a great case for your prioritization skills to shine :) Please, note all problems, order them by their priority, fix the top ones if you have some time left, and show us the prioritized list of the ones that still need fixing.

### It’s taking me more than the suggested 5-6 hours, what should I do?
It depends on why is it taking longer. Few tips:

* Avoid spending too much time on any one task and getting lost in the details – if you are stuck with something, feel free to ask us for help, whether it’s a configuration issue, a problem to debug, or another way to unblock you, we’ll be happy to help.
* Prioritize – make sure you do the most important tasks first and leave the “nice to haves” for if you have enough time.
* “The technologies are too foreign” – we have assumed familiarity with: how a web server side works, a C-based server-side language, and some browser and JavaScript knowledge. We have left some comments to guide you through the WordPress-specific bits, but by all means, if you can't find an answer to your question with a quick Google search, ask us. The goal is not to test the knowledge about a specific language or framework.

### I can’t reproduce the org chart rendering performance problem. Can you help me?
Run `lando wp rusty set --type=big` and then try opening the plugin admin page 🐌
