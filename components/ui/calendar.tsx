import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";

interface CalendarProps {
    onSelectedDate: (date: { day: number; weekday: string }) => void;
}

export function Calendar(props: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<{ day: number, weekday: string }>({ day: 10, weekday: "Wed" })

    // Dummy 4-day data
    const dates = [
        { day: 10, weekday: "Wed" },
        { day: 11, weekday: "Thu" },
        { day: 12, weekday: "Fri" },
        { day: 13, weekday: "Sat" },
    ];

    const handleSelectDate = (date: { day: number; weekday: string }) => {
        setSelectedDate(date);
        props.onSelectedDate(date);
    };

    return (
        <View
            style={{
                padding: 16,
                margin: 8,
                borderRadius: 12,
                gap: 16,
            }}
        >
            {/* Sample Date */}
            <View style={{ flexDirection: "column", gap: 10 }}>
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        icon="arrow-left"
                        mode="text"
                        textColor="#333333ff"
                        onPress={() => console.log('Prev')}
                    >
                        Aug
                    </Button>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold' }} >
                        September
                    </Text>
                    <Button
                        icon="arrow-right"
                        mode="text"
                        textColor="#333333ff"
                        onPress={() => console.log('Next')}
                        contentStyle={{ flexDirection: "row-reverse" }}
                    >
                        Oct
                    </Button>
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                {dates.map((date, index) => {
                    const isSelected = selectedDate.day === date.day && selectedDate.weekday === date.weekday;
                    return (
                        <TouchableOpacity key={index} onPress={() => handleSelectDate(date)} activeOpacity={0.7}>
                            <View
                                style={{
                                    width: 80,
                                    height: 100,
                                    borderRadius: 10,
                                    backgroundColor: isSelected ? "#333333ff" : "#adadadff",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text variant="headlineSmall" style={{ color: "white" }}>
                                    {date.day}
                                </Text>
                                <Text variant="bodySmall" style={{ color: "white" }}>
                                    {date.weekday}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
}