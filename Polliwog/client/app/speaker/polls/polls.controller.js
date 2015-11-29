/**
 * Created by paulnta on 28.11.15.
 */

angular.module('polliwogApp')
  .controller('PollsCtrl', function ($scope) {
    $scope.message = "PollsCtrl";
  })

  .controller('PollsListCtrl', function ($scope) {
    $scope.message = "PollsListCtrl";
    $scope.polls = [
      {
        title: "poll1",
        id: 1
      },
      {
        title: "poll2",
        id: 2
      },
      {
        title: "poll3",
        id: 3
      }
    ]
  });