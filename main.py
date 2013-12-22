import sys
import pyglet
from pyglet.gl import *
 
from shader import Shader
 
# create the window, but keep it offscreen until we are done with setup
window = pyglet.window.Window(640, 480, resizable=True, visible=False, caption="Life")
 
# centre the window on whichever screen it is currently on (in case of multiple monitors)
window.set_location(window.screen.width/2 - window.width/2, window.screen.height/2 - window.height/2)

def load(filename):
	f = open(filename, 'r')
	return f.read()

#check for command lines
if len(sys.argv) > 2:
	vertSrc = load(sys.argv[1])
	fragSrc = load(sys.argv[2])
else:
	vertSrc = load("vertexshader")
	fragSrc = load("fragshader")
 
# create our shader
shader = Shader([vertSrc], [fragSrc])
 
# bind our shader
shader.bind()
# set the correct texture unit
shader.uniformi('tex0', 0)
# unbind the shader
shader.unbind()
 
# create the texture
texture = pyglet.image.Texture.create(window.width, window.height, GL_RGBA)
 
# create a fullscreen quad
batch = pyglet.graphics.Batch()
batch.add(4, GL_QUADS, None, ('v2i', (0,0, 1,0, 1,1, 0,1)), ('t2f', (0,0, 1.0,0, 1.0,1.0, 0,1.0)))
 
# utility function to copy the framebuffer into a texture
def copyFramebuffer(tex, *size):
    # if we are given a new size
    if len(size) == 2:
        # resize the texture to match
        tex.width, tex.height = size[0], size[1]
 
    # bind the texture
    glBindTexture(tex.target, tex.id)
    # copy the framebuffer
    glCopyTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 0, 0, tex.width, tex.height, 0);
    # unbind the texture
    glBindTexture(tex.target, 0)
 
# handle the window resize event
@window.event
def on_resize(width, height):
    glViewport(0, 0, width, height)
    # setup a simple 0-1 orthoganal projection
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    glOrtho(0, 1, 0, 1, -1, 1)
    glMatrixMode(GL_MODELVIEW)
 
    # copy the framebuffer, which also resizes the texture
    copyFramebuffer(texture, width, height)
 
    # bind our shader
    shader.bind()
    # set a uniform to tell the shader the size of a single pixel
    shader.uniformf('pixel', 1.0/width, 1.0/height)
    # unbind the shader
    shader.unbind()
 
    # tell pyglet that we have handled the event, to prevent the default handler from running
    return pyglet.event.EVENT_HANDLED
 
# clear the window and draw the scene
@window.event
def on_draw():
    # clear the screen
    window.clear()
 
    # bind the texture
    glBindTexture(texture.target, texture.id)
    # and the shader
    shader.bind()
 
    # draw our fullscreen quad
    batch.draw()
 
    # unbind the shader
    shader.unbind()
    # an the texture
    glBindTexture(texture.target, 0)
 
    # copy the result back into the texture
    copyFramebuffer(texture)
 
# schedule an empty update function, at 60 frames/second
pyglet.clock.schedule_interval(lambda dt: None, 1.0/60.0)
 
# make the window visible
window.set_visible(True)
 
# finally, run the application
pyglet.app.run()
