import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: Colors.text,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: Colors.cardBackground,
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: Colors.text,
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    description: {
        fontSize: 14,
        color: Colors.lightText,
        marginTop: 4,
    },
    editButton: {
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 6,
        marginRight: 8,
    },
    editText: {
        color: Colors.white,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.accent,
        borderRadius: 28,
        padding: 14,
        elevation: 4,
    },
    deleteButton: {
        backgroundColor: Colors.red,
        padding: 8,
        borderRadius: 6,
        marginRight: 8,
    },
    row: {
        flexDirection: 'row',
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    label: {
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        color: Colors.text,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    formButton: {
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    value: {
        fontWeight: 'normal',
        color: Colors.lightText,
    },
    cardContent: {
        width: '90%',
        alignItems: 'flex-start',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 12,
    },
    tagButton: {
        backgroundColor: Colors.lightGray,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    tagButtonSelected: {
        backgroundColor: Colors.primary,
    },
    tagButtonText: {
        color: Colors.text,
        fontSize: 14,
    },
    tagButtonTextSelected: {
        color: Colors.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    halfWidthButton: {
        width: '48%',
    },
});
