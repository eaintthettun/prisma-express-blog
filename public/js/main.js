// In a script tag in layout.ejs or public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for reply buttons
    document.querySelectorAll('.reply-button').forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.dataset.commentId;
            const commentAuthor = this.dataset.commentAuthor;
            const replyFormContainer = this.closest('.flex-grow-1').querySelector('.reply-form-container');
            const replyFormTextarea = replyFormContainer.querySelector('textarea[name="content"]');

            if (replyFormContainer) {
                // Hide all other reply forms first (optional, but good UX)
                document.querySelectorAll('.reply-form-container').forEach(form => {
                    if (form !== replyFormContainer) {
                        form.style.display = 'none';
                    }
                });

                // Toggle the display of the clicked reply form
                if (replyFormContainer.style.display === 'none' || replyFormContainer.style.display === '') {
                    replyFormContainer.style.display = 'block';
                    replyFormTextarea.focus(); // Focus on the textarea when shown
                    replyFormTextarea.placeholder = `Replying to ${commentAuthor}`; // Set dynamic placeholder
                } else {
                    replyFormContainer.style.display = 'none';
                }
            }
        });
    });

    // Event listener for cancel buttons
    document.querySelectorAll('.cancel-reply').forEach(button => {
        button.addEventListener('click', function() {
            const replyFormContainer = this.closest('.reply-form-container');
            if (replyFormContainer) {
                replyFormContainer.style.display = 'none';
                replyFormContainer.querySelector('textarea').value = ''; // Clear the textarea
            }
        });
    });
});