import $ from 'jquery';

let page = 0;
let request = 0;

const loadLeaderboard = (season, requestPage) => {
  const rowHtml = $('#row').html();
  const statHtml = $('#stat').html();
  const $leaderboard = $('.leaderboard');
  const $spinner = $('.loading');

  $spinner.show();

  request = true;
  $.ajax('/data.php', {
    data: {
      season,
      page: requestPage,
    },
    method: 'get',
  })
    .done((data) => {
      data.entries.forEach((player) => {
        const entries = {
          Kills: player.pointBreakdown['TEAM_ELIMS_STAT_INDEX:1'].timesAchieved,
          'Kill Points': player.pointBreakdown['TEAM_ELIMS_STAT_INDEX:1'].pointsEarned,
          Matches: player.pointBreakdown['MATCH_PLAYED_STAT:1'].timesAchieved,
          Wins: player.pointBreakdown['PLACEMENT_STAT_INDEX:1'].timesAchieved,
          'Bus Fare Paid': player.pointBreakdown['MATCH_PLAYED_STAT:1'].pointsEarned * -1,
          Country: player.players[0].country,
        };

        const $row = $(
          rowHtml
            .replace(/:rank/g, player.rank)
            .replace(/:name/g, player.players[0].displayName)
            .replace(/:index/g, player.rank)
            .replace(/:hype/g, player.pointsEarned),
        );

        const $content = $row.find('.row__content');

        Object.entries(entries).forEach((stat) => {
          $content.append(
            statHtml
              .replace(':name', stat[0])
              .replace(':value', stat[1]),
          );
        });

        $row.find('.row__header').on('click', ({ currentTarget }) => {
          const $target = $(currentTarget);
          const targetId = $target.data('for');
          const $realTarget = $(`#${targetId}`);

          $realTarget.slideToggle();
        });

        $leaderboard.append($row);
      });
    })
    .always(() => {
      $spinner.show();
      request = false;
    });
};

export default () => {
  const $seasonSelect = $('#season');
  const $leaderboard = $('.leaderboard');

  loadLeaderboard($seasonSelect.val(), page);

  $seasonSelect.on('change', () => {
    $leaderboard.empty();
    page = 0;
    loadLeaderboard($seasonSelect.val(), page);
  });

  window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
      if (!request) {
        page += 1;
        loadLeaderboard($seasonSelect.val(), page);
      }
    }
  };
};
