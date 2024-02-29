"""empty message

<<<<<<<< HEAD:migrations/versions/42dc8f7ecd68_.py
Revision ID: 42dc8f7ecd68
Revises: 
Create Date: 2024-02-29 02:40:59.815511
========
Revision ID: cf3e2bc7d4c5
Revises: 
Create Date: 2024-02-29 02:05:52.336582
>>>>>>>> bf88f096c1188d0492af316eb75badff4b3e102a:migrations/versions/cf3e2bc7d4c5_.py

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
<<<<<<<< HEAD:migrations/versions/42dc8f7ecd68_.py
revision = '42dc8f7ecd68'
========
revision = 'cf3e2bc7d4c5'
>>>>>>>> bf88f096c1188d0492af316eb75badff4b3e102a:migrations/versions/cf3e2bc7d4c5_.py
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blocked_token_list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=100), nullable=True),
    sa.Column('date_time', sa.DateTime(), nullable=True),
    sa.Column('expires', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('jti')
    )
    op.create_table('role',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('schedules',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('time', sa.Date(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('availability_dates',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('time_id', sa.Integer(), nullable=False),
    sa.Column('availability', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['time_id'], ['schedules.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('name', sa.String(length=25), nullable=False),
    sa.Column('lastname', sa.String(length=25), nullable=False),
    sa.Column('dni', sa.String(length=15), nullable=False),
    sa.Column('email', sa.String(length=250), nullable=False),
    sa.Column('phone', sa.String(length=10), nullable=False),
    sa.Column('password', sa.String(length=150), nullable=False),
    sa.Column('virtual_link', sa.String(length=250), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('dni'),
    sa.UniqueConstraint('email')
    )
    op.create_table('reservation',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('time_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['time_id'], ['schedules.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('reservation')
    op.drop_table('user')
    op.drop_table('availability_dates')
    op.drop_table('schedules')
    op.drop_table('role')
    op.drop_table('blocked_token_list')
    # ### end Alembic commands ###
