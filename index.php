<?php get_header(); ?>

			<div id="content">

				<div id="inner-content" class="">

						<main id="main" class="" role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">

							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

							<article id="post-<?php the_ID(); ?>" <?php post_class( 'am-column' ); ?> role="article">

								<!-- <header class="article-header"> -->


								<!-- </header> -->

								<section class="entry-content ">
								<?php 
									if ( has_post_thumbnail() ) {
										the_post_thumbnail();
									} else {
										$first_image_thumb_url = get_first_image_thumb_url(get_the_ID());

										if($first_image_thumb_url == '') {
											$first_image_thumb_url = get_first_image_url_from_content(get_the_content());
										}

										printf('<a href="' . get_the_permalink() . '" rel="bookmark" >');

										if(!empty($first_image_thumb_url)) {
											printf( '<img src="' . $first_image_thumb_url . '" alt="' . single_post_title() . '-thumb" />');
											
										}
										else
										{
											the_excerpt();
										}
										printf('</a>');
									}
								?>
								</section>

								<footer class="article-footer ">
                 				<?php // printf( '<p class="footer-category">%1$s</p>' , get_the_category_list(' ') ); ?>
                  				<?php // the_tags( '<p class="footer-tags tags"><span class="tags-title">' . __( 'Tags:', 'bonestheme' ) . '</span> ', ', ', '</p>' ); ?>


									<h1 class="h2 entry-title"><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h1>
									<p class="byline entry-meta vcard">
												<?php printf( '%1$s',
                       								/* the time the post was published */
                       								'<time class="updated entry-time" datetime="' . get_the_time('Y-m') . '" itemprop="datePublished">' . get_the_time(get_option('date_format')) . '</time>'
                       								/* the author of the post */
                       								/* 

                       								'<span class="by">'.__( 'by', 'bonestheme').'</span> <span class="entry-author author" itemprop="author" itemscope 
                       								itemptype="http://schema.org/Person">' . get_the_author_link( get_the_author_meta( 'ID' ) ) . '</span>' 
                       								
                       								*/
                    							); ?>
									</p>
									                  				
								</footer>

							</article>

							<?php endwhile; ?>

							<?php else : ?>

									<article id="post-not-found" class="hentry ">
											<header class="article-header">
												<h1><?php _e( 'Oops, Post Not Found!', 'bonestheme' ); ?></h1>
										</header>
											<section class="entry-content">
												<p><?php _e( 'Uh Oh. Something is missing. Try double checking things.', 'bonestheme' ); ?></p>
										</section>
										<footer class="article-footer">
												<p><?php _e( 'This is the error message in the index.php template.', 'bonestheme' ); ?></p>
										</footer>
									</article>

							<?php endif; ?>


						</main>

									<?php bones_page_navi(); ?>
					<?php // get_sidebar(); ?>

				</div>

			</div>


<?php get_footer(); ?>
