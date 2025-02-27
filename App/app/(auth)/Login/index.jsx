import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

export default function LoginScreen() {
  const [selected, setSelected] = useState("student");
  const router=useRouter()
  
  return (
    <View className="flex items-center justify-center bg-white px-5">
      <Image source={{ uri: "https://via.placeholder.com/100" }} className="w-20 h-20" />
      <Text className="text-2xl font-bold mt-3">Smart Attendance</Text>
      <Text className="text-gray-500">Image-based Attendance System</Text>
      
      <View className="flex-row mt-4 space-x-3">
        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg items-center ${selected === "student" ? "bg-blue-600" : "bg-gray-200"}`}
          onPress={() => setSelected("student")}
        >
          <Text className={`${selected === "student" ? "text-white" : "text-black"}`}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg items-center ${selected === "faculty" ? "bg-blue-600" : "bg-gray-200"}`}
          onPress={() => setSelected("faculty")}
        >
          <Text className={`${selected === "faculty" ? "text-white" : "text-black"}`}>Faculty</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput 
        placeholder="Email or Student ID" 
        className="border p-3 rounded-lg mt-5 w-full" 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry={true} 
        className="border p-3 rounded-lg mt-3 w-full" 
      />
      
     
      
      <TouchableOpacity className="bg-blue-600 p-3 rounded-lg items-center w-full mt-4"onPress={() => router.push("/(tabs)/dashboard")}>
        <Text className="text-white font-bold">Login</Text>
      </TouchableOpacity>
      
    </View>
  );
}