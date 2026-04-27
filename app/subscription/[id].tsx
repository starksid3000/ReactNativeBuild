/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { View,Text } from "react-native";

const subscriptionDetails = () =>{
    const {id} = useLocalSearchParams<{id:string}>();
    return(
        <View>
            <Text> subscription Detials : {id}</Text>
            <Link href="/">Go back</Link>
        </View>
    )
}
export default subscriptionDetails; 
