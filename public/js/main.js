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

// for author follow btn notification alert
            const authorFollowBtn = document.getElementById('authorFollowBtn');

            if (authorFollowBtn) {  
                authorFollowBtn.addEventListener('click', async function () {
                    const authorId = this.dataset.authorId; //you get authorId from btn dataset defined in authorInfoBar.ejs
                    const authorName=this.dataset.authorName; 
                    try {
                        //you can also write fetch('/auth/${authorId}/toggle-follow')
                        const response = await fetch('/auth/toggle-follow', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ authorToFollowId: authorId })
                        });
                        if (response.status === 401) {
                            const result = await response.json();
                            alert(result.error); // ✅ Show "You must be logged in to follow topics."
                            return;
                        }
                        const result = await response.json();
                        if (result.followed) {
                            authorFollowBtn.classList.remove('btn-secondary');
                            authorFollowBtn.classList.add('btn-outline-secondary');
                            authorFollowBtn.innerHTML = `<i class="bi-person-plus"></i> Following`;
                            alert(`You followed user ${authorName}`);
                        } else if(!result.followed) {
                            authorFollowBtn.classList.remove('btn-outline-secondary');
                            authorFollowBtn.classList.add('btn-secondary');
                            authorFollowBtn.innerHTML = `<i class="bi-person-plus"></i> Follow`;
                            alert(`You unfollowed user ${authorName}`);
                        }
                    } catch (error) {
                        console.error('Follow error:', error);
                        alert('Something went wrong.');
                    }
                });
            }

        //for topic follow btn notification alert
                const topicFollowBtn = document.getElementById('topicFollowBtn');
                if(topicFollowBtn){
                    topicFollowBtn.addEventListener('click', async function() {
                        const topicId = this.dataset.topicId; //this topicId is from topicFollowBtn dataset in categoryOrTopicDetails.js
                        console.log('topicId:',topicId);
                        try {
                            const response = await fetch(`/topics/${topicId}/toggle-follow`, { 
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'  //this line very important
                            }
                            });
                            if (response.status === 401) {
                                const data = await response.json(); //accept json from auth middleware
                                const goLogin = confirm(`${data.error}\n\nClick OK to log in.`);
                                if (goLogin) {
                                  window.location.href = data.loginUrl; // Go to login
                                }
                                return; // Don't proceed further
                            }
                            const data = await response.json();
                            if (data.followed) {
                                topicFollowBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Following';
                                topicFollowBtn.classList.remove('btn-outline-dark');
                                topicFollowBtn.classList.add('btn-dark');
                                alert(`You followed topic`);
                            } else {
                                topicFollowBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i> Follow';
                                topicFollowBtn.classList.remove('btn-dark');
                                topicFollowBtn.classList.add('btn-outline-dark');
                                alert(`You unfollowed topic`);
                            }
                            
                            // Update followers count
                            const followersCountEl = document.querySelector('.followers-count');
                            if (followersCountEl) {
                                followersCountEl.textContent = `${data.followersCount} followers`;
                            }
                        }catch (error) {
                            console.error('Follow error:', error);
                            alert('Something went wrong.');
                        }
                    });
                };//end if

                
            });



            document.body.addEventListener('click', async function(event) {
                // Like button clicked
                if (event.target.classList.contains('like-btn')) {
                  console.log('like btn clicked');
                  const button = event.target;
                  const postId = button.dataset.postId;
              
                  const response = await fetch('/posts/like-temp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                  });
              
                  const data = await response.json();
                  if (data.success) {
                    const countEl = document.getElementById(`like-count-${postId}`);
                    const currentCount = parseInt(countEl.textContent);
                    countEl.textContent = currentCount + 1;
              
                    button.textContent = '❤️ Liked';
                    button.classList.remove('like-btn');
                    button.classList.add('unlike-btn');
                  }
                }
              
                // Unlike button clicked
                else if (event.target.classList.contains('unlike-btn')) {
                  console.log('unlike btn clicked');
                  const button = event.target;
                  const postId = button.dataset.postId;
              
                  const response = await fetch(`/posts/${postId}/unlike-post`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                  });
              
                  const data = await response.json();
                  console.log('response in front end:',data);
                  if (data.success) {
                    const countEl = document.getElementById(`like-count-${postId}`);
                    const currentCount = parseInt(countEl.textContent);
                    countEl.textContent = currentCount - 1;
              
                    button.textContent = '♡ Like';
                    button.classList.remove('unlike-btn');
                    button.classList.add('like-btn');
                  }
                }
              });
              