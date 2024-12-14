package org.erijl.wahlentwicklung.utils;

import org.erijl.wahlentwicklung.ElectionParser;
import org.erijl.wahlentwicklung.protos.objects.*;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

public class ValidationUtil {

    final static String[] blacklistedMethods = {"getElectionYear", "getPartyId"};

    public static void validateElectionParser(ElectionParser electionParser) {

        // Checks that the sum of all state base votes matches with the election total
        assertPropertiesOfClassMatchSummedList(StateVoteBase.class, electionParser.getStateBaseVotes(), ElectionVoteBase.class, electionParser.getElectionBaseVotes());

        // Checks that the sum of all constituency base votes matches with the election total
        assertPropertiesOfClassMatchSummedList(ConstituencyVoteBase.class, electionParser.getConstituencyVotesBase(), ElectionVoteBase.class, electionParser.getElectionBaseVotes());


        // Checks that the sum of all state party votes matches with the election total
        assertPropertiesOfClassMatchSummedList(StateVoteParty.class, electionParser.getStatePartyVotes(), ElectionVoteParty.class, electionParser.getElectionPartyVotes());

        // Checks that the sum of all constituency party votes matches with the election total
        assertPropertiesOfClassMatchSummedList(ConstituencyVoteParty.class, electionParser.getConstituencyPartyVotes(), ElectionVoteParty.class, electionParser.getElectionPartyVotes());
    }

    private static <T, U> void assertPropertiesOfClassMatchSummedList(Class<T> listClass, List<T> list, Class<U> objectClass, List<U> objectList) {
        getValidMethods(listClass, objectClass)
                .forEach(methodName ->
                        validateSummedListAgainstSummedList(
                                list,
                                getMethod(listClass, methodName),
                                objectList,
                                getMethod(objectClass, methodName)
                        )
                );
    }

    private static <T, U> void assertPropertiesOfClassMatchSummedList(Class<T> listClass, List<T> list, Class<U> objectClass, U object) {
        assertPropertiesOfClassMatchSummedList(listClass, list, objectClass, Collections.singletonList(object));
    }

    private static <T, U> void validateSummedListAgainstSummedList(List<T> list, Method listClassMethod, List<U> objectList, Method objectClassMethod) {
        try {
            assert sumObjectList(objectList, objectClassMethod) == sumObjectList(list, listClassMethod);
        } catch (Exception | Error e) {
            System.out.println(e);
        }
    }

    private static <T> long sumObjectList(List<T> list, Method method) {
        return list.stream().mapToLong(entry -> {
            try {
                return (long) method.invoke(entry);
            } catch (Exception e) {
                System.out.println(e);
            }
            return 0;
        }).sum();
    }

    private static <T, U> Stream<String> getValidMethods(Class<T> listClass, Class<U> objectClass) {
        return Arrays.stream(objectClass.getDeclaredMethods())
                .filter(method ->
                        !Arrays.asList(blacklistedMethods).contains(method.getName()) &&
                                method.getReturnType() == long.class &&
                                method.getName().startsWith("get") &&
                                Arrays.stream(listClass.getDeclaredMethods()).map(Method::getName).toList().contains(method.getName()))
                .map(Method::getName);
    }

    private static <T> Method getMethod(Class<T> methodClass, String methodName) {
        try {
            return methodClass.getMethod(methodName);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
