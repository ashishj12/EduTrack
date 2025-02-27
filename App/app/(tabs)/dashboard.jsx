import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FacultyDashboard() {
  const handleTakeAttendance = () => {
    router.push('../screens/CameraAttendance');
  };
  const handleRecords = () => {
    router.push('../Records');
  };
  const handleReports = () => {
    router.push('../Reports');
  };
  const handleSettings = () => {
    router.push('../Settings');
  };

  return (
    <ScrollView className="flex-1 bg-white py-12 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl sm:text-3xl font-bold">Faculty Dashboard</Text>
          <Text className="text-gray-500 text-sm sm:text-base">Welcome, Dr. Smith</Text>
        </View>
        <TouchableOpacity>
          <Image 
            source={{ uri: 'https://via.placeholder.com/50' }} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" 
          />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity 
          className="items-center w-1/4"
          onPress={handleTakeAttendance}
        >
          <View className="bg-blue-100 p-3 rounded-full">
            <Ionicons name="camera" size={24} color="blue" />
          </View>
          <Text className="text-center mt-2 text-xs sm:text-sm">Take Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center w-1/4" onPress={handleRecords}>
          <View className="bg-purple-100 p-3 rounded-full">
            <Ionicons name="list" size={24} color="purple" />
          </View>
          <Text className="text-center mt-2 text-xs sm:text-sm">View Records</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center w-1/4" onPress={handleReports}>
          <View className="bg-green-100 p-3 rounded-full">
            <Ionicons name="stats-chart" size={24} color="green" />
          </View>
          <Text className="text-center mt-2 text-xs sm:text-sm">Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center w-1/4" onPress={handleSettings}>
          <View className="bg-orange-100 p-3 rounded-full">
            <Ionicons name="settings" size={24} color="orange" />
          </View>
          <Text className="text-center mt-2 text-xs sm:text-sm">Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Classes */}
      <View className="mb-6">
        <Text className="text-lg sm:text-xl font-bold mb-4">Today's Classes</Text>
        <View className="flex-row justify-between space-x-2">
          <View className="w-1/2 bg-gray-100 p-4 rounded-lg">
            <Text className="font-bold text-base">Computer Science</Text>
            <Text className="text-gray-500 text-sm">09:00 AM</Text>
            <Text className="text-green-600 mt-2 text-sm">Room 101 - Completed</Text>
          </View>
          <View className="w-1/2 bg-gray-100 p-4 rounded-lg ml-2">
            <Text className="font-bold text-base">Data Structures</Text>
            <Text className="text-gray-500 text-sm">11:00 AM</Text>
            <Text className="text-blue-600 mt-2 text-sm">Room 203 - Ongoing</Text>
          </View>
        </View>
      </View>

      {/* Attendance Summary */}
      <View className="flex-row justify-between mb-6">
        {[
          { label: 'Total Students', value: '120', color: 'text-blue-600' },
          { label: 'Present Today', value: '98', color: 'text-green-600' },
          { label: 'Absent Today', value: '22', color: 'text-red-600' },
          { label: 'Attendance Rate', value: '82%', color: 'text-purple-600' },
        ].map((item, index) => (
          <View key={index} className="w-1/4 items-center">
            <Text className={`text-2xl font-bold ${item.color}`}>{item.value}</Text>
            <Text className="text-gray-500 text-xs text-center">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Attendance */}
      <View>
        <Text className="text-lg sm:text-xl font-bold mb-4">Recent Attendance</Text>
        {[
          { course: 'Computer Science', time: '09:00 AM', attendance: '40/45' },
          { course: 'Data Structures', time: '11:00 AM', attendance: '35/38' },
          { course: 'Algorithms', time: '02:00 PM', attendance: '42/45' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-2"
          >
            <View>
              <Text className="font-bold text-base">{item.course}</Text>
              <Text className="text-gray-500 text-sm">{item.time}</Text>
            </View>
            <Text className="text-blue-600 text-sm">{item.attendance} Students</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
