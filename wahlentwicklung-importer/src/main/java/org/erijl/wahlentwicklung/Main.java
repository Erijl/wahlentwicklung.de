package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;
import org.erijl.wahlentwicklung.protos.objects.*;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) throws SQLException, IOException { //TODO proper error handling to
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (ElectionEnum election : ElectionEnum.getElectionsInArray(config.getArrayProperty(ConfigKeyEnum.YEARS_TO_IMPORT))) {
            ElectionParser parser = new ElectionParser(election);

            List<ElectionParty> parties = parser.getParties(); //TODO fix all the ifs and elses replace with an enum that determines whether the row is header, state, election or constituency or categorize them before hand into different arrays
            List<ElectionState> states = parser.getStates();
            List<ElectionConstituency> constituencies = parser.getConstituencies();

            ElectionVoteBase electionBaseVotes = parser.getElectionVotesBase();
            List<StateVoteBase> stateBaseVotes = parser.getStateVotesBase();
            List<ConstituencyVoteBase> constituencyVotesBase = parser.getConstituencyVotesBase();

            List<ElectionVoteParty> electionPartyVotes = parser.getElectionVotesParty(parties);
            List<StateVoteParty> statePartyVotes = parser.getStateVotesParty(parties);
            List<ConstituencyVoteParty> constituencyPartyVotes = parser.getConstituencyVotesParty(parties);

            // Assert that all state votes summed up equal the total election votes
            assert electionBaseVotes.getActualvotersPrimaryvoteDefinitiv() == stateBaseVotes.stream().map(StateVoteBase::getActualvotersPrimaryvoteDefinitiv).mapToLong(Long::longValue).sum();

            // Assert that all constituency votes summed up for each state equal the total state votes
            states.forEach(state -> {
                Optional<StateVoteBase> stateBaseVote = stateBaseVotes.stream().filter(stateVotes -> stateVotes.getStateId() == state.getRowId()).findFirst();
                assert stateBaseVote.isPresent();
                assert stateBaseVote.get().getActualvotersPrimaryvoteDefinitiv() == constituencyVotesBase.stream().filter(constituency -> constituency.getStateId() == state.getRowId()).map(ConstituencyVoteBase::getActualvotersPrimaryvoteDefinitiv).mapToLong(Long::longValue).sum();
            });

            // Assert that all constituency votes summed up equal the total election votes
            assert electionBaseVotes.getActualvotersPrimaryvoteDefinitiv() == constituencyVotesBase.stream().map(ConstituencyVoteBase::getActualvotersPrimaryvoteDefinitiv).mapToLong(Long::longValue).sum();

            assert electionBaseVotes.getActualvotersPrimaryvoteDefinitiv() == (constituencyPartyVotes.stream().map(ConstituencyVoteParty::getPrimaryvoteDefinitiv).mapToLong(Long::longValue).sum() + electionBaseVotes.getInvalidvotersPrimaryvoteDefinitiv());

            try {
                sumObjectList(ConstituencyVoteBase.class, constituencyVotesBase, ConstituencyVoteBase.class.getMethod("getActualvotersPrimaryvoteDefinitiv"));
            }catch (Exception e) {
                System.out.println(e);
            }

            try {
                validateObjectPropertyAgainstSummedList(
                        StateVoteBase.class,
                        electionBaseVotes,
                        stateBaseVotes,
                        StateVoteBase.class.getMethod("getActualvotersPrimaryvoteDefinitiv"),
                        ElectionVoteBase.class.getMethod("getActualvotersPrimaryvoteDefinitiv")
                );

            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }

    private static <T, U> void validateObjectPropertyAgainstSummedList(Class<T> listClass, U object, List<T> list, Method listClassMethod, Method objectClassEthod) {
        try {
            assert (long) objectClassEthod.invoke(object) == sumObjectList(listClass, list, listClassMethod);
        } catch (Exception e ) {
            System.out.println(e);
        }
    }

    private static <T> long sumObjectList(Class<T> listClass, List<T> list, Method method) {
        return list.stream().mapToLong(entry -> {
            try {
                return (long) method.invoke(entry);
            } catch (Exception e) {
                System.out.println(e);
            }
            return 0;
        }).sum();
    }

    /**
     * Throws an error when assertions are not enabled
     */
    private static void ensureAssertionsAreEnabled() {
        try {
            assert false;
        } catch (AssertionError error) {
            return;
        }

        throw new AssertionsNotEnabledError();
    }
}