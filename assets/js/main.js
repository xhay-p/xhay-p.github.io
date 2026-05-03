jQuery(document).ready(function($) {


    /*======= Skillset *=======*/
    
    $('.level-bar-inner').css('width', '0');
    
    $(window).on('load', function() {

        $('.level-bar-inner').each(function() {
        
            var itemWidth = $(this).data('level');
            
            $(this).animate({
                width: itemWidth
            }, 800);
            
        });

    });
    
    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    
    /* jQuery RSS - https://github.com/sdepold/jquery-rss */
    $("#rss-feeds").rss(
    
        //Change this to your own rss feeds
        "http://feeds.feedburner.com/TechCrunch/startups",
        
        {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 3,
        
        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',
        
        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: "<div class='item'>{entries}</div>",
        
        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>'
        
        }
    );
    
    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "caseyscarborough", selector: "#ghfeed" });

    /* Fetch last commit dates for tutorials */
    function fetchLastCommitDate(repo, path, element) {
        var apiUrl = 'https://api.github.com/repos/' + repo + '/commits';
        if (path) {
            apiUrl += '?path=' + encodeURIComponent(path) + '&per_page=1';
        } else {
            apiUrl += '?per_page=1';
        }
        
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && data.length > 0 && data[0].commit && data[0].commit.author && data[0].commit.author.date) {
                    var commitDate = new Date(data[0].commit.author.date);
                    var formattedDate = commitDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                    element.find('.update-date').text(formattedDate);
                    element.show();
                }
            },
            error: function(xhr, status, error) {
                // Silently fail if API call fails (e.g., rate limit)
                console.log('Could not fetch commit date for ' + repo);
            }
        });
    }

    // Fetch commit dates for all tutorial items
    $('.item[data-repo]').each(function() {
        var $item = $(this);
        var repo = $item.data('repo');
        var path = $item.data('path');
        var $lastUpdated = $item.find('.last-updated');
        
        if (repo && $lastUpdated.length) {
            fetchLastCommitDate(repo, path, $lastUpdated);
        }
    });


});