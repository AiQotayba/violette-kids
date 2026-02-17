import { Text } from '@/components/Text';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, Linking, Pressable, View } from 'react-native';
import { getYoutubeVideoId, YoutubeEmbed } from '../YoutubeEmbed';

export class ContentEngine {
    constructor(public content: any) {
        this.description = this.description.bind(this);
        this.ageLabel = this.ageLabel.bind(this);
        this.categories = this.categories.bind(this);
        this.title = this.title.bind(this);
        this.video = this.video.bind(this); 
    }
    description() {
        if (!this.content.description) return
        return (
            <Text className="text-[15px] mb-5 bg-slate-100 rounded-lg p-4 w-full" style={{ color: colors.neutral[800] }}>
                {this.content.description}
            </Text>
        )
    }
    ageLabel() {
        if (!this.content.ageMin || !this.content.ageMax) return
        return (
            <Text className="text-[15px] mb-2 bg-slate-100 rounded-lg p-2 flex h-10 items-center justify-center" style={{ color: colors.neutral[800] }}>
                {this.content.ageMin} - {this.content.ageMax}
            </Text>
        )
    }
    categories() {
        if (!this.content.categories) return
        return (
            <View className="flex-row flex-wrap gap-2 mb-3">
                <this.ageLabel />
                {this.content.categories.map((cat: any) => (
                    <View
                        key={cat.id}
                        className="px-2.5 py-1.5 rounded-lg flex-row items-center gap-1.5 bg-slate-100 flex h-10" 
                    >
                        {cat.icon ? (
                            <Image source={{ uri: cat.icon }} className="h-4 w-4" resizeMode="contain" />
                        ) : null}
                        <Text className="text-[13px] font-medium"   >
                            {cat.name}
                        </Text>
                    </View>
                ))}
            </View>
        )
    }
    title() {
        return (
            <Text className="text-[22px] mb-2" style={{ color: colors.neutral[800], fontFamily: 'Tajawal_700Bold' }}>{this.content.title}</Text>
        )
    }
    video() {
        const videoUrl = this.content.contentUrl;
        const isYoutube = videoUrl ? !!getYoutubeVideoId(videoUrl) : false;
        const { width } = Dimensions.get('window');
        const embedHeight = Math.round((width - 32) * (9 / 16));
        if (!videoUrl || !isYoutube) return null;
        if (isYoutube) return <YoutubeEmbed url={videoUrl} />;
        if (!videoUrl) return null;
        return (
            <Pressable
                className="self-center rounded-xl overflow-hidden mb-6 bg-black"
                style={{ width: width - 32, height: embedHeight }}
                onPress={() => Linking.openURL(videoUrl).catch(() => { })}
            >
                {this.content.thumbnailUrl ? (
                    <Image
                        source={{ uri: this.content.thumbnailUrl }}
                        className="absolute inset-0"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="absolute inset-0" style={{ backgroundColor: colors.neutral[100] }} />
                )}
                <View className="absolute inset-0 bg-black/35 justify-center items-center gap-3">
                    <View className="w-16 h-16 rounded-full justify-center items-center" style={{ backgroundColor: colors.neutral[100] }}>
                        <Text className="text-[28px] ml-1" style={{ color: colors.neutral[800] }}>
                            <Ionicons name="play" size={24} color={colors.neutral[800]} />
                        </Text>
                    </View>
                    <Text className="text-base font-semibold text-white">اضغط لمشاهدة الفيديو</Text>
                </View>
            </Pressable>
        );
    } 
    notfound() {
        return (
            <View className="flex-1 justify-center items-center py-8" style={{ backgroundColor: colors.neutral[100] }}>
                <Text className="text-base text-center" style={{ color: colors.neutral[800] }}>
                    لم نجد هذا المحتوى
                </Text>
            </View>
        );
    }
}