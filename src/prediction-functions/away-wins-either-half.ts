import { betOptionModel } from "../models/bet-option-model";
import { FixtureDataModel } from "../models/fixtures";
import { StandingsDataStandingModel, StandingsModel } from "../models/standings-models";
import { betOptions } from "../variables/variables";
import { againstAwayTeamGoalsPercentage, againstHomeTeamGoalsPercentage, awayTeamGoalsPercentage, awayTeamScroreInMostAwayFixtures, awayTeamWinsMostMatchesTimes, getAwayTeamStanding, getHomeTeamStanding, getLastFiveTeamAwayFixtures, getLastFiveTeamHomeFixtures, homeTeamFailWinningInMostHomeFixtures, homeTeamGoalsPercentage, otherAwayTeamGoalsInHomeFixtures } from "./shared-functions";


export const predictAwayWinsEitherHalf = ({
    currentFixtures,
    allFixtures,
    leaguesStandings,
  }: {
    currentFixtures: FixtureDataModel[];
    allFixtures: FixtureDataModel[];
    leaguesStandings: StandingsModel[];
  }) => {
    const predictedFixtures = currentFixtures.filter(currentFixture => {
      const lastFiveHomeTeamHomeFixtures = getLastFiveTeamHomeFixtures({
        teamId: currentFixture.teams.home.id,
        allFixtures,
      });
      const lastFiveAwayTeamAwayFixtures = getLastFiveTeamAwayFixtures({
        teamId: currentFixture.teams.away.id,
        allFixtures,
      });
      const homeTeamStanding: StandingsDataStandingModel = getHomeTeamStanding({
        standings: leaguesStandings,
        homeTeamId: currentFixture.teams.home.id,
        leagueId: currentFixture.league.id,
      });
  
      const awayTeamStanding: StandingsDataStandingModel = getAwayTeamStanding({
        standings: leaguesStandings,
        awayTeamId: currentFixture.teams.away.id,
        leagueId: currentFixture.league.id,
      });
      if (lastFiveHomeTeamHomeFixtures.length >= 3) {
        return (
          ((awayTeamWinsMostMatchesTimes({
            fixtures: lastFiveAwayTeamAwayFixtures,
            awayTeamId: currentFixture.teams.away.id,
          }) &&
            otherAwayTeamGoalsInHomeFixtures({
              homeTeamFixtures: lastFiveHomeTeamHomeFixtures,
              goals: 1,
            }) &&
            homeTeamFailWinningInMostHomeFixtures({
              homefixtures: lastFiveHomeTeamHomeFixtures,
            }) &&
            awayTeamGoalsPercentage({ awayTeamStanding }) >= 160 &&
            againstHomeTeamGoalsPercentage({ homeTeamStanding }) >= 150) ||
            (awayTeamGoalsPercentage({ awayTeamStanding }) >= 160 &&
              homeTeamGoalsPercentage({ homeTeamStanding }) <= 80 &&
              againstHomeTeamGoalsPercentage({ homeTeamStanding }) >= 150)) &&
          awayTeamScroreInMostAwayFixtures({
            awayfixtures: lastFiveAwayTeamAwayFixtures,
            minGoals: 1,
          }) &&
          otherAwayTeamGoalsInHomeFixtures({
            homeTeamFixtures: lastFiveHomeTeamHomeFixtures,
            goals: 1,
          }) &&
          awayTeamGoalsPercentage({ awayTeamStanding }) >= 130 &&
          againstHomeTeamGoalsPercentage({ homeTeamStanding }) >= 130 &&
          againstAwayTeamGoalsPercentage({ awayTeamStanding }) <= 150 &&
          homeTeamFailWinningInMostHomeFixtures({
            homefixtures: lastFiveHomeTeamHomeFixtures,
          }) 
        );
      }
      return false;
    });
  
    return {
      fixtures: predictedFixtures,
      option: betOptions.find(option => option.id === 14) as betOptionModel,
    }; //TODO can look into making that betoption id a enum
  };