package org.erijl.wahlentwicklung.utils;

import org.erijl.wahlentwicklung.ElectionParser;
import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteBase;
import org.erijl.wahlentwicklung.protos.objects.ElectionVoteBase;
import org.erijl.wahlentwicklung.protos.objects.StateVoteBase;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

public class ValidationUtil {

    public static void validateElectionParser(ElectionParser electionParser) {
        System.out.println();
        System.out.println();
        System.out.printf("-------------------------------------------------------\n");
        System.out.printf("-------------------- Election %d --------------------\n", electionParser.getElection().getYear());
        System.out.printf("-------------------------------------------------------\n");

        // Checks that the sum of all state base votes matches with the election total
        assertPropertiesOfClassMatchSummedList(StateVoteBase.class, ElectionVoteBase.class, electionParser.getStateBaseVotes(), electionParser.getElectionBaseVotes());

        // Checks that the sum of all constituency base votes matches with the election total
        assertPropertiesOfClassMatchSummedList(ConstituencyVoteBase.class, ElectionVoteBase.class, electionParser.getConstituencyVotesBase(), electionParser.getElectionBaseVotes());
    }

    private static <T, U> void assertPropertiesOfClassMatchSummedList(Class<T> listClass, Class<U> objectClass, List<T> list, U object) {
        String[] blacklistedMethods = {"getElectionYear"};//TODO make it final static ...
        Arrays.stream(objectClass.getDeclaredMethods())
                .filter(method ->
                        method.getName().startsWith("get") &&
                                method.getReturnType() == long.class &&
                                !Arrays.asList(blacklistedMethods).contains(method.getName()) &&
                                Arrays.stream(listClass.getDeclaredMethods()).map(Method::getName).toList().contains(method.getName()))
                .forEach(method -> {
                    try {
                        validateObjectPropertyAgainstSummedList(
                                listClass,
                                object,
                                list,
                                listClass.getMethod(method.getName()),
                                objectClass.getMethod(method.getName())
                        );

                    } catch (Exception e) {
                        System.out.println(method.getName() + "!!!!");
                        System.out.println(e);
                    }
                });
    }

    private static <T, U> void validateObjectPropertyAgainstSummedList(Class<T> listClass, U object, List<T> list, Method listClassMethod, Method objectClassMethod) {
        try {
            assert (long) objectClassMethod.invoke(object) == sumObjectList(list, listClassMethod);
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
}
