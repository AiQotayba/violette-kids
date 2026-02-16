import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface PageHeaderProps {
    title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    const router = useRouter();
    const colorScheme = useEffectiveColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View
            className="flex-row items-center gap-3 py-3 my-4"
            style={{ backgroundColor: colors.background }}
        >
            <Pressable
                onPress={() => router.back()}
                hitSlop={12}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={({ pressed }) => ({
                    backgroundColor: pressed ? colors.muted : 'transparent',
                })}
            >
                <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.text}
                    style={{ transform: [{ scaleX: -1 }] }}
                />
            </Pressable>
            <Text
                className="flex-1 text-lg font-bold"
                numberOfLines={1}
                style={{ color: colors.text }}
            >
                {title}
            </Text>
        </View>
    );
}
