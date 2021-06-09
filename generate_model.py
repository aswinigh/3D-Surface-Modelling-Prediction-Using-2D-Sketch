import bpy
import pathlib
import os
import bmesh
from mathutils import Vector

def NormalInDirection( normal, direction, limit = 0.5 ):
    return direction.dot( normal ) > limit
def GoingUp( normal, limit = 0.5):
    return NormalInDirection( normal, Vector( (0, 0, 1 ) ), limit )
bpy.ops.mesh.primitive_grid_add(enter_editmode=False, location=(0, 0, 0))
bpy.ops.object.editmode_toggle()
bpy.ops.mesh.subdivide()
bpy.ops.mesh.subdivide()
bpy.ops.mesh.subdivide()
bpy.ops.mesh.subdivide()
bpy.ops.object.editmode_toggle()

bpy.ops.object.modifier_add(type='DISPLACE')


#Getting an existing material from a different blender file
bpy.ops.wm.append(
    filepath="HeightMapToModel2.blend",
    directory="./HeightMapToModel2.blend\\Material\\",
    filename="FinalMaterial")
heightTex = bpy.data.textures.new('Depth Texture', type = 'IMAGE')
depsgraph = bpy.context.evaluated_depsgraph_get()


#Displacing mesh by adding displacement modifier

bpy.data.images.load(filepath="predicted_depth.png", check_existing=False)
heightTex.image = bpy.data.images['predicted_depth.png']
bpy.context.object.modifiers["Displace"].texture = bpy.data.textures['Depth Texture']
bpy.context.object.modifiers["Displace"].strength = 0.1
bpy.ops.object.shade_smooth()
bpy.ops.object.modifier_apply(apply_as='DATA', modifier="Displace")
obj = bpy.context.active_object

mat = bpy.data.materials.get("FinalMaterial")

bpy.context.object.active_material = mat
bpy.ops.mesh.primitive_cube_add(size=2, enter_editmode=False, location=(0, 0, -1))
objects = bpy.data.objects
cube = objects['Cube']
grid = objects['Grid']

# Removing all the vertices which were not displaced

bool_one = grid.modifiers.new(type="BOOLEAN", name="bool 1")
bool_one.object = cube
bool_one.operation = 'DIFFERENCE'
bpy.context.view_layer.objects.active = grid
bpy.ops.object.modifier_apply(modifier="bool 1")

# grid.modifier_apply(apply_as='DATA', modifier="bool 1")
bpy.data.objects['Cube'].select_set(True)
bpy.ops.object.delete()


bpy.ops.export_scene.obj(filepath='./model/test.obj')


