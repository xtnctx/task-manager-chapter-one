import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";


interface TaskModalProps {
    visible: boolean;
    onDismiss: () => void;
    titleDescription: { title: string, description: string }
    setTitleDescription: (val: { title: string, description: string }) => void;
    onSave: () => void;
    isEditing: boolean;
}

export function TaskModal(props: TaskModalProps) {
    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.onDismiss}
                contentContainerStyle={styles.modalWrapper}
            >
                <View style={styles.modalContainer}>
                    <Text variant="titleLarge" style={{ marginBottom: 16 }}>
                        {props.isEditing ? "Edit Task" : "Add Task"}
                    </Text>

                    <TextInput
                        label="Title"
                        value={props.titleDescription.title}
                        onChangeText={val => props.setTitleDescription({ ...props.titleDescription, title: val })}
                        mode="outlined"
                        style={{ marginBottom: 12, backgroundColor: 'white' }}
                    />
                    <TextInput
                        label="Description"
                        value={props.titleDescription.description}
                        onChangeText={val => props.setTitleDescription({ ...props.titleDescription, description: val })}
                        mode="outlined"
                        multiline
                        style={{ marginBottom: 16, backgroundColor: 'white' }}
                    />

                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button textColor="#333333ff" onPress={props.onDismiss}>Cancel</Button>
                        <Button mode="contained" buttonColor="#333333ff" onPress={props.onSave} style={{ marginLeft: 8 }}>
                            Save
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
    }
});