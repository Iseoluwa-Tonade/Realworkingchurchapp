const formatDate = (date) => {
    if (!date) return '';
    // Firestore Timestamps have a toDate() method
    if (date.toDate) date = date.toDate();

    // Check for invalid date objects
    if (isNaN(new Date(date).getTime())) return '';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default formatDate;
