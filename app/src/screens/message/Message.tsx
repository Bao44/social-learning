import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { SquarePen } from 'lucide-react-native'
import useAuth from '../../../hooks/useAuth'
import ListConversation from './components/ListConversation'

const Message = () => {
  const { user } = useAuth()
  return (
    <View className='p-4 flex gap-2'>
      {/* Header */}
      <View className="flex flex-row justify-between items-center px-2">
        <Header title={user?.name || 'User'} />
        <SquarePen width={32} height={32} />
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Find conversations or users"
        className="border border-gray-300 rounded-lg p-4 text-base"
      />

      {/* Conversations List */}
      <ListConversation />
    </View>
  )
}

export default Message