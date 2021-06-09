#!/usr/bin/env bash
source ~/.bash_profile
blender -b HeightMapToModel.blend -P generate_model.py
echo "map_Bump predicted_normal.png" >> ./model/test.mtl